import { AutocompleteInteraction, Client, Collection, SlashCommandBuilder, type CommandInteraction, type SlashCommandOptionsOnlyBuilder } from "discord.js";
import { ViewModel } from "./data/view-model.js";

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
    viewModel : ViewModel = new ViewModel()
}

export interface Image {
    image_id: bigint,
    filename: string,
    hash: string,
}

export interface Tag {
    name : string,
    time_created: string
}

export function isTag(object: any): object is Tag {
    return 'tag_id' in object && 'tag_name' in object;
}