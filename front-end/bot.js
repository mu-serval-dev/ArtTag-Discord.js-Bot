const { token } = require('../config.json');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { onHello } = require('./hello-listener');
const { onTwitLinkSend, containsLink, grabLink } = require('./twit-link-listener');

const links = {};

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

// MessageCreate Listeners
// client.on('messageCreate', msg => {
// 	if (!msg.author.bot) {
// 		console.log(msg.content);

// 		// Replies with link stored for given emote
// 		if (Object.hasOwn(links, msg.content)) {
// 			console.log(links[msg.content]);
// 			msg.reply(links[msg.content]);
// 		}
// 	}

// });


client.on('guildCreate', guild => {
	console.log('joined a new guild!');

	// TODO: when bot joins a new guild, make a new table for that guild
});

// MessageReactionAdd
client.on('messageReactionAdd', rctn => {
	const match = grabLink(rctn.message.content);

	if (match) {
		// "Built in" emojis don't need the <:>
		const emoji = rctn.emoji.id ? '<:' + rctn.emoji.identifier + '>' : rctn.emoji.name;
		links[emoji] = match;

		rctn.message.reply(match);
		console.log(JSON.stringify(links));
	}
});

// Log client into discord
client.login(token);
