import { CommandInteraction, SlashCommandBuilder, CommandInteractionOptionResolver, type CacheType, AutocompleteInteraction, type ApplicationCommandOptionChoiceData } from "discord.js";
import { CommandClient, type AutocompleteHandler, type Command, type CommandExecuteFunc } from "../types.js";
import { MAX_TAG_LENGTH, TAG_SEPARATOR } from "../data/tags-model.js";

const IMAGE_OPT_NAME = "image"
const TAG_OPT_NAME = "tag"

const def = new SlashCommandBuilder()
    .setName("store")
    .setDescription("Store an image file.")
    .addAttachmentOption((option) => option
        .setRequired(true)
        .setName(IMAGE_OPT_NAME)
        .setDescription("The image to save"))
    .addStringOption((option) => option
        .setMaxLength(MAX_TAG_LENGTH)
        .setRequired(true)
        .setName(TAG_OPT_NAME)
        .setAutocomplete(true)
        .setDescription("Tag for this image"))

// TODO: string option.setAutocomplete with list of tags we pull from API

const storeCommand:CommandExecuteFunc = async function (interaction: CommandInteraction) {
    // Widen type to use getAttachment/getString
    const options = <Omit<CommandInteractionOptionResolver<CacheType>,''>> interaction.options

    const image = options.getAttachment(IMAGE_OPT_NAME)
    const tag = options.getString(TAG_OPT_NAME)

    if (!image || !tag) {
        await interaction.reply(`Error, image or tag was missing`)
        return
    }

    await interaction.reply(`Got image ${image.name} with tag ${tag}`)
    // TODO: filter for image file type
}

/**
 * Suggest tag or list of tags based on
 * current input for tags param.
 * @param interaction AutocompleteInteraction
 */
const tagsAutocomplete:AutocompleteHandler = async function (interaction: AutocompleteInteraction) {
    const client = interaction.client as CommandClient
    const focusedValue = interaction.options.getFocused()
    const split = focusedValue.replaceAll(' ', '').split(TAG_SEPARATOR);

    const last = split.pop()

    // no autocomplete if nothing was entered
    if (!last || last === "") {
        await interaction.respond([])
        return
    }

    const tag_choices = client.tagsViewModel.getTagsWithPrefix(last)
                                            .filter(tag => {return !split.includes(tag.tag_name)}) // dont suggest tags that were already used
    
    const rejoined = split.join(TAG_SEPARATOR)

    const response: ApplicationCommandOptionChoiceData[] = tag_choices.map(tag => {
        const formatted = (split.length > 0)? `${rejoined},${tag.tag_name}` : tag.tag_name
        return {
            name: formatted,
            value: formatted
        }
    })

    await interaction.respond(response)
}

const command:Command = {
    data : def,
    autocomplete: tagsAutocomplete,
    execute: storeCommand
}

export default command