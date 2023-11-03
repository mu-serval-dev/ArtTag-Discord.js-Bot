const { token, prefix } = require('../config.json');
const { getCommand } = require('./commands');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { insert } = require('./database/queries');

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
	// TODO: should these be exclusive? figure that out. i think
	// there may be duplicates in embeds and attachments thingy.
	// may be best to just add 1st image.

	console.log('embeds: ', msg.embeds);
	console.log('attachments: ', msg.attachments);

	// if (msg.embeds[0]) {
	// 	if (msg.embeds[0].thumbnail && msg.embeds[0].thumbnail.url) {
	// 		return msg.embeds[0].thumbnail.url;
	// 	}
	// 	else if (msg.embeds[0].image && msg.embeds[0].image.url) {
	// 		return msg.embeds[0].image.url;
	// 	}
	// }
	// else if (msg.attachments.size > 0) {
	// 	// TODO: just for loop over map, gathering attachment links
	// 	const arr = Array.from(msg.attachments); // attachments is a map

	// 	const first_attach = arr[0][1]; // Object containing attachment data
	// 	if (first_attach.attachment) {
	// 		return first_attach.attachment;
	// 	}
	// 	else if (first_attach.url) {
	// 		return first_attach.url;
	// 	}
	// }
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

	const bits = msg.content.substring(1).split(' ');
	if (bits.length == 0) {
		return;
	}

	const commandName = bits[0];
	const command = getCommand(commandName);

	if (!command) {
		return;
	}

	command(msg, bits);
});

// On MessageReactionAdd
client.on('messageReactionAdd', rctn => {
	// TODO: update to use slash commands instead
	const msg = rctn.message;

	if (!rctn.message.author.bot) {
		const embedLink = retrieveEmbedLink(msg);

		if (embedLink) {
			console.log(`Inserting ${embedLink}\n\tinto guild ${rctn.message.guildId}\n\twith emoji ${rctn.emoji.toString()}`);

			insert(rctn.message.guildId, rctn.emoji.toString(), embedLink)
				.then(res => {
					console.log('\tDone! ✔');
				})
				.catch (err => {
					console.log('\tCould not insert link to database ❌' + '\n\t\t' + err.message);
				});
		}
	}
});

// #endregion

// Log client into discord
client.login(token);
