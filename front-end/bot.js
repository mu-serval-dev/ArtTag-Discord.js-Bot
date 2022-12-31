const { token } = require('../config.json');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { parseLink } = require('./link-parser');

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
	] });


// Wait for client to be ready
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// #region Add Listeners

// On MessageCreate
client.on('messageCreate', msg => {
	if (!msg.author.bot) {
		console.log(msg.content);

		// Replies with link stored for given emote
		if (Object.hasOwn(links, msg.content)) {
			console.log(links[msg.content]);
			msg.reply(links[msg.content]);
		}
	}

});

// On GuildCreate
client.on('guildCreate', guild => {
	console.log('joined a new guild!');

	// TODO: when bot joins a new guild, make a new table for that guild
});

// On MessageReactionAdd
client.on('messageReactionAdd', rctn => {
	const match = parseLink(rctn.message.content);

	if (match) {
		// "Built in" emojis don't need the <:>
		const emoji = rctn.emoji.id ? '<:' + rctn.emoji.identifier + '>' : rctn.emoji.name;
		links[emoji] = match;

		// TODO: remove debug statements
		rctn.message.reply(match);
		// console.log(JSON.stringify(links));
	}
});

// #endregion

// Log client into discord
client.login(token);
