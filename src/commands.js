const { getQuip } = require('./quips');
const { select } = require('./database/queries');
const { pagination } = require('discord.js-pagination');
const { EmbedBuilder } = require('discord.js');
// const paginationEmbed = require("discord.js-pagination");

/**
 * Returns helpful information about the bot.
 * @param {Message<boolean>} msg User command message
 * @param {Array<string>} bits User command message split into an array around spaces
 * @returns string Help string
 */
function help(msg, bits) {
	msg.reply(getQuip() + '\n```My name is ArtBot and I do things!\nConsider me your personal butler for saving art...```');
}

/**
 * Replies to msg with the links contained in rows.
 * @param {String} msg Original command message.
 * @param {Array} rows Array of art links from db.
 */
function displayLinks(msg, rows) {
	let response = [];

	// TODO: sort links based on emote count
	for (let i = 0; i < rows.length; i++) {
		response.push(rows[i].link);
	}

	// const res = new EmbedBuilder();
	// res.setAuthor({"name" : msg.author.username, "iconURL" : msg.author.avatarURL()});
	// res.setColor(0x0099ff);
	// //res.setTitle("Tagged with :nerd:");
	// res.setDescription(":nerd:") // can insert discord emoji
	// res.setFooter({"text" : "1 of 1"})
	// res.setImage("https://pbs.twimg.com/media/Fz6pTLyaQAELw6p.jpg")
	// msg.reply({'embeds' : [res]});

	// TODO: use action rows to add buttons

	msg.reply(getQuip() + '\n' + response.join('\n'));
}

/**
 * Display embed list of artlinks saved under the
 * given emote.
 * @param {Message<boolean>} msg User command message
 * @param {Array<string>} bits User command message split into an array around spaces
 */
function show(msg, bits) {
	if (bits.length < 2) {
		msg.reply('Sorry, I need an emoji to retrieve your collection.');
		return;
	}

	const emoji = bits[1];
	const guildID = msg.guildId;

	console.log(`Retrieving links from\n\tguild ${guildID}\n\twith emoji ${emoji}`);

	select(guildID, emoji).then(res => {
		displayLinks(msg, res.rows);
		console.log('\tDone! ✔');
		// console.log(res.rows);
		// const link = res.rows[0].link;
		// msg.reply(`Here you go! \n${link}`);
	}).catch(err => {
		if (err.code == 42703) { // Column doesn't exist
			msg.reply('Hmm... it looks like that emoji hasn\'t been used yet.');
		}
		console.log('\tCould not retrieve links ❌' + '\n\t\t' + err.message);
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