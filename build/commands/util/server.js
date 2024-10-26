import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import {} from "../../types.js";
const def = new SlashCommandBuilder()
    .setName("server")
    .setDescription("Get information about the server.");
const func = async function (interaction) {
    await interaction.reply(`This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`);
};
const command = {
    data: def,
    execute: func
};
export default command;
