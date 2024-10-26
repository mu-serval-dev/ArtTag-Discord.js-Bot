import { Client, Collection, SlashCommandBuilder } from "discord.js";
/**
 * Check if object implements the Command interface.
 *
 * @param object
 * @returns True if object has Command props.
 */
export function isCommand(object) {
    return 'data' in object && 'execute' in object;
}
/**
 * Discord client with a collection of Commands.
 */
export class CommandClient extends Client {
    commands = new Collection();
}
