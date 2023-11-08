const { getQuip } = require('./quips');
const { select } = require('./database/queries');
const { pagination } = require('@devraelfreeze/discordjs-pagination');
const { prefix } = require('../config.json');
const { EmbedBuilder, CommandInteraction } = require('discord.js');
const embed_timeout = 30000; // 30 seconds
const max_interactions = 30;

// TODO: move commands into separate files to cleanup this file
// TODO: move this to a text file or indent it somehow
const help_text = `\`\`\`Pleasure to meet you! My name is ArtBot and I'm your personal art collecting assistant! Here's some info about how I work:\n\nAnytime you or another server member reacts to an image attachment or embed with an emoji, that image is "tagged" with that emoji and is added to a server-wide collection of art that can be queried with the 'show' command. I also keep track of how many times an image has been tagged with a certain emoji, so you can see which image was most popular!\n\nCommands:\n'${prefix}help': display this help text\n'${prefix}show <emoji>': display a collection of images tagged with the given emoji\`\`\``;

/**
 * Returns helpful information about the bot.
 * @param {Message<boolean>} msg User command message
 * @param {Array<string>} bits User command message split into an array around spaces
 * @returns string Help string
 */
function help(msg, bits) {
	msg.reply(getQuip() + '\n' + help_text);
}

/**
 * Replies to msg with the links contained in rows.
 * @param {String} msg Original command message.
 * @param {Array} rows Array of art links from db.
 */
function displayLinks(msg, rows) {
	if (rows.length == 0) {
		msg.reply('Sorry, I couldn\'t find any links with that emoji.');
		return;
	}

	let embeds = rows.map((x) => {
		return new EmbedBuilder()
			.setImage(x.link)
			.setDescription(`${x.emoteID} ${x.emoteCount}`);
	});

	// Only allow interaction initiator to navigate embed
	const author_id = msg.author.id;
	const cust_filter = (interaction) => {
		return interaction.member.user.id == author_id;
	};

	// todo: add custom buttons
	const pagination_options = {
		message : msg,
		ephemeral : false,
		embeds : embeds,
		author : msg.member.user,
		time : embed_timeout,
		disableButtons : true,
		fastSkip : false,
		pageTravel : false,
		max : max_interactions,
		customFilter : cust_filter,
	};

	pagination(pagination_options);
}

/**
 * Display embed list of artlinks saved under the
 * given emote.
 * @param {Message<boolean>} msg User command message
 * @param {Array<string>} pieces User command message split into an array around spaces
 * @param
 */
function show(msg, pieces) {
	// TODO: take emoji as argument so we can build the embeds
	if (pieces.length < 2) {
		msg.reply('Sorry, I need an emoji to retrieve your collection.');
		return;
	}

	const emoji = pieces[1];
	const guildID = msg.guildId;

	console.log(`[INFO] Retrieving links from guild ${guildID} with emoji ${emoji}`);

	select(guildID, emoji).then(res => {
		displayLinks(msg, res.rows);
		console.log('[INFO] Done! ✔');
	}).catch(err => {
		if (err.code == 42703) { // Column doesn't exist
			msg.reply('Hmm... it looks like that emoji hasn\'t been used yet.');
		}
		console.log('[ERROR] Could not retrieve links ❌' + '\n\t' + err.message);
	});
}

// TODO: utilizing typescript here might be nice to
// ensure all these command functions take the proper argument.
// Each command function should take the user's message that
// contained the command as an arg.

/**
 * Object mapping command strings to
 * functions.
 */
const commands = {
	'help' : help,
	'show' : show,
};

/**
 * Gets the proper function to execute based
 * on the given text command. May return undefined
 * if there is no such function (i.e., the command
 * does not exist).
 * @param {string} cmd String command typed by user
 * @returns Function to execute for given command
 */
function getCommand(cmd) {
	return commands[cmd];
}

exports.getCommand = getCommand;