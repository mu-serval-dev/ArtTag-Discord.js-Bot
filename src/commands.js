const { getQuip } = require("./quips")

/**
 * Returns helpful information about the bot.
 * @returns string Help string
 */
function help(msg) {
    msg.reply(getQuip() + "\n```This bot sucks```")
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
    "help" : help
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