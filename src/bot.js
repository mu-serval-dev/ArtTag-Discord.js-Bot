const { token, prefix } = require('../config.json');
const { getCommand } = require('./commands')
const { Client, Events, GatewayIntentBits } = require('discord.js');

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
	// TODO: add query listeners
	// TODO: handle possible errors
	if (msg.author.bot || msg.content[0] !== prefix) {
		return;
	}

	const command = msg.content.substring(1);
	const toExec = getCommand(command);

	if (toExec === undefined) {
		return;
	}

	const res = toExec();
	msg.reply(res);
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

		const embedLink = retrieveEmbedLink(msg);
		if (embedLink) { msg.reply(embedLink + ' ' + emoji);}
	}
});

// #endregion

// Log client into discord
client.login(token);
