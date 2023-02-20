const { token } = require('../config.json');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { parseLink } = require('./link-parser');
const { NoticeMessage } = require('pg-protocol/dist/messages');

// Object to hold links in reactions for testing purposes
const links = {};

// Create new Client with Intents
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildEmojisAndStickers,
	],
});

// #region Add Listeners

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', msg => {
	// TODO: add query listeners
	// TODO: handle possible errors
	// 1. A provided emote is not in the database
	// 2. There is no artlink with the given emote tag in the database
	// Note: 2 should technically not be possible with how insertions are handled, but it might
	// be nice to handle in the case deletions/decrements are added later
});


// On GuildCreate
client.on('guildCreate', guild => {
	console.log(`Joined a new guild ${guild.name}`);

	// TODO: when bot joins a new guild, make a new table for that guild
});

// On MessageReactionAdd
client.on('messageReactionAdd', rctn => {
	const msg = rctn.message;
	// const emoji = msg.guild.emojis.cache.get(rctn.emoji.id);
	// console.log(emoji);


	if (!rctn.message.author.bot) {
		// "Built in" emojis don't need the <:>
		const emoji = rctn.emoji.id ? '<:' + rctn.emoji.identifier + '>' : rctn.emoji.name;
		// TODO: handle animated emotes that have 'a' at the beginning

		if (msg.embeds[0]) {
			if (msg.embeds[0].thumbnail && msg.embeds[0].thumbnail.url) {
				msg.reply(msg.embeds[0].thumbnail.url + ' ' + emoji);
			}
			else if (msg.embeds[0].image && msg.embeds[0].image.url) {
				msg.reply(msg.embeds[0].image.url + ' ' + emoji);
			}
		}
		else if (msg.attachments[0] && msg.attachments[0].url) {
			msg.reply(msg.attachments[0].url + ' ' + emoji);
		}
	}
});

// #endregion

// Log client into discord
client.login(token);
