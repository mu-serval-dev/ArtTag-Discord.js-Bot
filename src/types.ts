import { Client, Collection, SlashCommandBuilder, type CommandInteraction, type SlashCommandOptionsOnlyBuilder } from "discord.js";

export interface CommandExecuteFunc {
	(interaction: CommandInteraction) : Promise<void>
}

export interface Command {
    data : SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
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
}



export interface Image {
    image_id: BigInt,
    filename: string,
    hash: string,
}

export interface Tag {
    tag_id : BigInt,
    tag_name: string
}