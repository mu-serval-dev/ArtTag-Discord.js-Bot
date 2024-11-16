import { SlashCommandBuilder, type CommandInteraction } from "discord.js";
import { type Command, type CommandExecuteFunc } from "../../types.js";

const def = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!");

const func:CommandExecuteFunc = async function (interaction: CommandInteraction) {
    await interaction.reply("pong!");
}

const command:Command = {
    data: def,
    autocomplete: null,
    execute: func
}

export default command;