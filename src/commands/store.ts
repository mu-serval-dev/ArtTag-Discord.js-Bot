import { CommandInteraction, SlashCommandBuilder, CommandInteractionOptionResolver, type CacheType } from "discord.js";
import { MAX_TAG_LENGTH, type Command, type CommandExecuteFunc } from "../types.js";

const IMAGE_OPT_NAME = "image"
const TEXT_OPT_NAME = "tag"

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
        .setName(TEXT_OPT_NAME)
        .setDescription("Tag for this image"))

// TODO: string option.setAutocomplete with list of tags we pull from API

const func:CommandExecuteFunc = async function (interaction: CommandInteraction) {
    // Widen type to use getAttachment/getString
    const options = <Omit<CommandInteractionOptionResolver<CacheType>,''>> interaction.options

    const image = options.getAttachment(IMAGE_OPT_NAME)
    const tag = options.getString(TEXT_OPT_NAME)

    if (!image || !tag) {
        await interaction.reply(`Error, image or tag was missing`)
        return
    }

    await interaction.reply(`Got image ${image.name} with tag ${tag}`)
    // TODO: filter for image file type
}

const command:Command = {
    data : def,
    execute: func
}

export default command