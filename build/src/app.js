import configjson from '../config.json' assert { type: 'json' };
import { Client, Collection, CommandInteraction, Events, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { CommandClient } from './types.js';
const client = new CommandClient({
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
    // TODO: register commands
});
client.login(configjson.token);
