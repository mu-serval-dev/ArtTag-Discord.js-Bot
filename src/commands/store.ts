import { CommandInteraction, SlashCommandBuilder, CommandInteractionOptionResolver, type CacheType, AutocompleteInteraction, type ApplicationCommandOptionChoiceData } from "discord.js";
import { CommandClient, type AutocompleteHandler, type Command, type CommandExecuteFunc, type Tag } from "../types.js";
import { MAX_TAG_LENGTH, TAG_SEPARATOR } from "../data/view-model.js";

const IMAGE_OPT_NAME = "image"
const TAG_OPT_NAME = "tags"

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

const storeCommand:CommandExecuteFunc = async function (interaction: CommandInteraction) {
    // Widen type to use getAttachment/getString
    const options = <Omit<CommandInteractionOptionResolver<CacheType>,''>> interaction.options

    const image = options.getAttachment(IMAGE_OPT_NAME)
    const tags = options.getString(TAG_OPT_NAME)

    if (!image || !tags) {
        await interaction.reply(`Error, image or tag was missing`)
        return
    }

    await interaction.reply(`Got image ${image.name} with tag ${tags}`)
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
    const split = focusedValue.split(TAG_SEPARATOR);

    const last = split.pop() // last tag user typed

    const splitSet = new Set(split) // use set to filter out duplicates

    // no autocomplete if nothing was entered
    if (!last || last === "") {
        await interaction.respond([])
        return
    }

    // get list of tags not in splitSet
    let tag_choices:Array<Tag> = client.viewModel.getTagsNotIn(splitSet)
    // filter for tags that begin with current tag user is typing
    tag_choices = tag_choices.filter(tag => tag.name.startsWith(last, 0))

    
    const rejoined = split.join(TAG_SEPARATOR)

    const response: ApplicationCommandOptionChoiceData[] = tag_choices.map(tag => {
        const formatted = (split.length > 0)? `${rejoined}${TAG_SEPARATOR}${tag.name}` : tag.name
        // NOTE: name shows in user's input box, value is what is sent to the server
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