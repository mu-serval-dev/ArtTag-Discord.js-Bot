/**
 * Returns helpful information about the bot.
 * @returns string Help string
 */
function help() {
    return "This bot sucks";
}

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