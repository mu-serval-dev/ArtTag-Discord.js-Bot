import { CommandInteraction, SlashCommandBuilder, CommandInteractionOptionResolver, type CacheType, AutocompleteInteraction, type ApplicationCommandOptionChoiceData } from "discord.js";
import { CommandClient, type Artist, type AutocompleteHandler, type Command, type CommandExecuteFunc, type Tag } from "../types.js";
import { MAX_TAG_LENGTH, TAG_SEPARATOR, MAX_ARTIST_LENGTH, MAX_URL_LENGTH } from "../data/view-model.js";

const IMAGE_OPT_NAME = "image"
const TAG_OPT_NAME = "tags"
const ARTIST_OPT_NAME = "artist"
const URL_OPT_NAME = "source"
const NSFW_OPT_NAME = "nsfw"

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
    .addStringOption((option) => option
        .setMaxLength(MAX_ARTIST_LENGTH)
        .setRequired(false)
        .setName(ARTIST_OPT_NAME)
        .setAutocomplete(true)
        .setDescription("Name of the artist"))
    .addStringOption((option) => option
        .setMaxLength(MAX_URL_LENGTH)
        .setRequired(false)
        .setName(URL_OPT_NAME)
        .setDescription("Source url for the image"))
    .addBooleanOption((option) => option
        .setRequired(false)
        .setName(NSFW_OPT_NAME)
        .setDescription("Is this image nsfw?"))

const storeCommand:CommandExecuteFunc = async function (interaction: CommandInteraction) {
    // Widen type to use getAttachment/getString
    const options = <Omit<CommandInteractionOptionResolver<CacheType>,''>> interaction.options

    const image = options.getAttachment(IMAGE_OPT_NAME)
    const tags = options.getString(TAG_OPT_NAME)
    const artist = options.getString(ARTIST_OPT_NAME)
    const url = options.getString(URL_OPT_NAME)
    const nsfw = options.getBoolean(NSFW_OPT_NAME) ?? false

    if (!image || !tags) {
        await interaction.reply(`Error, image or tags was missing`)
        return
    }

    let params = [
        `tags ${tags}`
    ]

    if (artist) {
        params.push(`artist ${artist}`)
    }
    if (url) {
        params.push(`source ${url}`)
    }


    await interaction.reply(`Got ${(nsfw)? 'nsfw': 'sfw'} image ${image.name} with ${params.join(", ")}`)
    // TODO: filter for image file type
}

/**
 * Suggest tag or list of tags based on
 * current input for tags param.
 * 
 * Handles response. THE SAME INTERACTION SHOULD NOT BE RESPONDED TO AFTER
 * CALLING THIS FUNCTION!
 * @param currentValue Current value for param typed by user
 * @param interaction AutocompleteInteraction to respond to
 */
const handleTagsAutocomplete = async function (currentValue: string, interaction: AutocompleteInteraction) {
    const client = interaction.client as CommandClient
    // const focusedValue = interaction.options.getFocused()
    const split = currentValue.split(TAG_SEPARATOR);

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

/**
 * Suggest list of artists based on
 * current input for artist param.
 * 
 * Handles response. THE SAME INTERACTION SHOULD NOT BE RESPONDED TO AFTER
 * CALLING THIS FUNCTION!
 * @param currentValue Current value for param typed by user
 * @param interaction AutocompleteInteraction to respond to
 */
const handleArtistAutcomplete = async function (currentValue:string, interaction: AutocompleteInteraction) {
    const client = interaction.client as CommandClient

    // no autocomplete if nothing was entered
    if (!currentValue || currentValue === "") {
        await interaction.respond([])
        return
    }

    const artist_choices:Array<Artist> = client.viewModel.getArtistsBeginningWith(currentValue);
    const response: ApplicationCommandOptionChoiceData[] = artist_choices.map(artist => {
        return {
            name: artist.name,
            value: artist.name
        }
    })

    await interaction.respond(response)
}

/**
 * Handles autocomplete for the store commmand, passing interaction to proper
 * handler.
 * @param interaction  AutocompleteInteraction to respond to
 */
const handleAutocomplete:AutocompleteHandler = async function (interaction: AutocompleteInteraction) {
    const focusedOption = interaction.options.getFocused(true)
    const optionName = focusedOption.name

    switch(optionName) {
        case TAG_OPT_NAME:
            handleTagsAutocomplete(focusedOption.value, interaction)
            break;
        case ARTIST_OPT_NAME:
            handleArtistAutcomplete(focusedOption.value, interaction)
            break;
        default:
            console.warn(`[WARN] /store command got unknown option '${optionName}'`)
    }
}


const command:Command = {
    data : def,
    autocomplete: handleAutocomplete,
    execute: storeCommand
}

export default command