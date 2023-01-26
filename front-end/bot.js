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
	] });


// Wait for client to be ready
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// #region Add Listeners

// TODO: add query listeners
// TODO: handle possible errors
// 1. A provided emote is not in the database
// 2. There is no artlink with the given emote tag in the database
// Note: 2 should technically not be possible with how insertions are handled, but it might
// be nice to handle in the case deletions/decrements are added later

// On MessageCreate
client.on('messageCreate', msg => {
	if (!msg.author.bot) {
		console.log(msg.content);

		// Replies with link stored for given emote
		if (Object.hasOwn(links, msg.content)) {
			const embed = {
				title : 'A Title',
				url : links[msg.content],
			};

			msg.reply({ embeds : [embed] });
		}
	}

});

// On GuildCreate
client.on('guildCreate', guild => {
	console.log('joined a new guild!');

	// TODO: when bot joins a new guild, make a new table for that guild
});

// TODO: handle animated emotes that have 'a' at the beginning
// TODO: figure out how to embed images? need to get actual image link through api...

// On MessageReactionAdd
client.on('messageReactionAdd', rctn => {
	const match = parseLink(rctn.message.content);

	if (!rctn.message.author.bot && match) {
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
