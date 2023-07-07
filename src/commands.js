const { getQuip } = require("./quips")
const { pagination } = require('discord.js-pagination')
const { EmbedBuilder } = require('discord.js');
// const paginationEmbed = require("discord.js-pagination");

/**
 * Returns helpful information about the bot.
 * @param {*} msg User command message
 * @returns string Help string
 */
function help(msg) {
    msg.reply(getQuip() + "\n```This bot sucks```")
}

/**
 * Display embed list of artlinks saved under the
 * given emote.
 * @param {*} msg User command message
 */
function show(msg){
    // TODO

    const res = new EmbedBuilder();
    res.setAuthor({"name" : msg.author.username, "iconURL" : msg.author.avatarURL()});
    res.setColor(0x0099ff);
    //res.setTitle("Tagged with :nerd:");
    res.setDescription(":nerd:") // can insert discord emoji
    res.setFooter({"text" : "1 of 1"})
    res.setImage("https://pbs.twimg.com/media/Fz6pTLyaQAELw6p.jpg")
    msg.reply({'embeds' : [res]});

    // TODO: use action rows to add buttons
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
    "help" : help,
    "show" : show
}

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