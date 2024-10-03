import configjson from '../config.json' assert { type: 'json' };
import { Client, Events, GatewayIntentBits } from 'discord.js';


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildEmojisAndStickers,
	],
});

client.once(Events.ClientReady, client => {
    console.debug(`[INFO] Ready! Logged in as ${client.user.tag}`);
})

client.login(configjson.token);