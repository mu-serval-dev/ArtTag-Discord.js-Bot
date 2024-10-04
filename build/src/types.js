import { Client, Collection, SlashCommandBuilder } from "discord.js";
export class CommandClient extends Client {
    commands = new Collection();
}
