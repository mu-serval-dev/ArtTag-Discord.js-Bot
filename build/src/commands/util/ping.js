import { SlashCommandBuilder } from "discord.js";
import {} from "../../types.js";
const def = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!");
const func = async function (interaction) {
    await interaction.followUp("pong!");
};
const command = {
    data: def,
    execute: func
};
export default command;
