import { SlashCommandBuilder, type CommandInteraction } from "discord.js";
import { type Command, type CommandExecuteFunc } from "../../types.js";

const def = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!");

const func:CommandExecuteFunc = async function (interaction: CommandInteraction) {
    await interaction.followUp("pong!");
}

const command:Command = {
    data: def,
    execute: func
}

export default command;