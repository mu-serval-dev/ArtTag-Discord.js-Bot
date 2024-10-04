import { Client, Collection, SlashCommandBuilder, type CommandInteraction } from "discord.js";

export interface CommandExecuteFunc {
	(interaction: CommandInteraction) : Promise<void>
}

export interface Command {
    data : SlashCommandBuilder,
    execute: CommandExecuteFunc
}

export class CommandClient extends Client {
	commands : Collection<string, Command> = new Collection<string,Command>()
}