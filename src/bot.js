const { token, prefix } = require('../config.json');
const { getCommand } = require('./commands');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { insert } = require('./database/queries');

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
 * Retrieves all image links in the given message.
 * @param {Message} msg Message to retrieve links from.
 * @returns An array of urls for all embed images / attachments in msg.
 */
function retrieveLinks(msg) {
	let links = msg.embeds.map((embed) => embed.thumbnail.url);

	msg.attachments.forEach((v, k) => {
		links.push(v.url);
	});

	return links;
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
		const links = retrieveLinks(msg);

		if (links.length == 0) {
			return;
		}

		console.log(`[INFO] Inserting ${links.length} links\n\tinto guild ${rctn.message.guildId}\n\twith emoji ${rctn.emoji.toString()}`);
		insert(rctn.message.guildId, rctn.emoji.toString(), links)
			.then(res => {
				console.log('\tDone! ✔');
			})
			.catch (err => {
				console.log('\t[ERR] Could not insert link to database ❌' + '\n\t\t' + err.message);
			});
	}
});

// #endregion

// Log client into discord
client.login(token);
