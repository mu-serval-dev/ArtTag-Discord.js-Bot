const { token, prefix } = require('../config.json');
const { getCommand } = require('./commands')
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { insert } = require('./database/queries')

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

/**
 * Returns the first embed link in the given message, if possible.
 * @param {Message} msg Message to retrieve link from
 * @returns The string url for the first embed in the given Message, or null
 */
function retrieveEmbedLink(msg) {
	if (msg.embeds[0]) {
		if (msg.embeds[0].thumbnail && msg.embeds[0].thumbnail.url) {
			return msg.embeds[0].thumbnail.url;
		}
		else if (msg.embeds[0].image && msg.embeds[0].image.url) {
			return msg.embeds[0].image.url;
		}
	}
	else if (msg.attachments.size > 0) {
		// TODO: just for loop over map, gathering attachment links
		const arr = Array.from(msg.attachments); // attachments is a map
		const first_attach = arr[0][1]; // Object containing attachment data
		if (first_attach.attachment) {
			return first_attach.attachment;
		}
		else if (first_attach.url) {
			return first_attach.url;
		}
	}
	return null;
}

// #region Add Listeners

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', msg => {
	// Ignore if message is sent by a bot or does not start with prefix
	if (msg.author.bot || msg.content[0] !== prefix) {
		return;
	}

	bits = msg.content.substring(1).split(" ")

	if (bits.length == 0) {
		return;
	}


	const commandName = bits[0];
	const command = getCommand(commandName); // get command's function

	if (command === undefined) {
		return;
	}
	
	command(msg, bits);
	
	// 1. A provided emote is not in the database
	// 2. There is no artlink with the given emote tag in the database
	// Note: 2 should technically not be possible with how insertions are handled, but it might
	// be nice to handle in the case deletions/decrements are added later
});

// On MessageReactionAdd
client.on('messageReactionAdd', rctn => {
	const msg = rctn.message;
	// const emoji = msg.guild.emojis.cache.get(rctn.emoji.id);
	// console.log(emoji);
	if (!rctn.message.author.bot) {
		// "Built in" emojis don't need the <:>
		const emoji = rctn.emoji;
		// TODO: handle animated emotes that have 'a' at the beginning

		const embedLink = retrieveEmbedLink(msg);

		if (embedLink) { 
			console.log(`Guild ${rctn.message.guildId} -> link ${embedLink}`)

			insert(rctn.message.guildId, rctn.emoji.toString(), embedLink).then(res => {
				console.log(`Inserted link ${res}`)
			})
			.catch (err => {
				console.log(err.message)
			})

			// TODO: update QResult object to be useful for insertion queries, or just remove it lol
		}
	}
});

// #endregion

// Log client into discord
client.login(token);
