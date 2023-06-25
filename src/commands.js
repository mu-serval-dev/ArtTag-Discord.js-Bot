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
    //res.setAuthor("Wiggy");
    res.setColor(0x0099ff);
    res.setTitle("Wiggy")
    res.setDescription("wiggy is cute")
    res.setImage("https://cdn.discordapp.com/attachments/275847048647933952/1122348247390892062/PXL_20230624_194802311.jpg")
    msg.reply({'embeds' : [res]});
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