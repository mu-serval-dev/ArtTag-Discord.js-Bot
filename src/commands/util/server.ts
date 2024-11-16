import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { type Command, type CommandExecuteFunc } from "../../types.js";

const def = new SlashCommandBuilder()
    .setName("server")
    .setDescription("Get information about the server.")

const func:CommandExecuteFunc = async function (interaction: CommandInteraction) {
    await interaction.reply(`This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`)
}

const command:Command = {
    data:def,
    autocomplete: null,
    execute: func
}

export default command