import { AutocompleteInteraction, Client, Collection, SlashCommandBuilder, type CommandInteraction, type SlashCommandOptionsOnlyBuilder } from "discord.js";
import { TagsViewModel } from "./data/tags.js";

export interface CommandExecuteFunc {
	(interaction: CommandInteraction) : Promise<void>
}

export interface AutocompleteHandler {
    (interaction: AutocompleteInteraction) : Promise<void>
}

export interface Command {
    data : SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    autocomplete : AutocompleteHandler | null,
    execute: CommandExecuteFunc
}

/**
 * Check if object implements the Command interface.
 * 
 * @param object 
 * @returns True if object has Command props.
 */
export function isCommand(object: any): object is Command {
    return 'data' in object && 'execute' in object;
}

/**
 * Discord client with a collection of Commands.
 */
export class CommandClient extends Client {
	commands : Collection<string, Command> = new Collection<string,Command>()
    tagsViewModel : TagsViewModel = new TagsViewModel()
}

export interface Image {
    image_id: bigint,
    filename: string,
    hash: string,
}

export interface Tag {
    tag_id : bigint,
    tag_name: string
}

export function isTag(object: any): object is Tag {
    return 'tag_id' in object && 'tag_name' in object;
}