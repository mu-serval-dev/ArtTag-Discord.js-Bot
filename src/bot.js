const { token, prefix, art_channel_id, bot_channel_id } = require('../config.json');
const { getCommand } = require('./commands');
const { Client, Events, GatewayIntentBits, ActivityType } = require('discord.js');
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
	c.user.setPresence({
		activities: [
			{
				name: `${prefix}help`,
				type: ActivityType.Listening,
			},
		],
		status: 'online',
	});
	console.log(`[INFO] Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', msg => {
	// Ignore if message is sent by a bot or does not start with prefix
	if (msg.channelId !== bot_channel_id || msg.author.bot || msg.content[0] !== prefix) {
		return;
	}

	const pieces = msg.content.substring(1).split(' ');
	if (pieces.length == 0) {
		return;
	}

	const commandName = pieces[0];
	const command = getCommand(commandName);

	if (!command) {
		return;
	}

	command(msg, pieces);
});

// On MessageReactionAdd
client.on('messageReactionAdd', rctn => {
	// TODO: remove
	if (rctn.message.channelId !== art_channel_id) {
		return;
	}

	// TODO: update to use slash commands instead
	const msg = rctn.message;

	if (!rctn.message.author.bot) {
		const links = retrieveLinks(msg);

		if (links.length == 0) {
			return;
		}

		console.log(`[INFO] Inserting ${links.length} links into guild ${rctn.message.guildId} with emoji ${rctn.emoji.toString()}`);
		insert(rctn.message.guildId, rctn.emoji.toString(), links)
			.then(res => {
				console.log('[INFO] Done! ✔');
			})
			.catch (err => {
				console.log('[ERROR] Could not insert link to database ❌' + '\n\t' + err.message);
			});
	}
});

// #endregion

// Log client into discord
client.login(token);
