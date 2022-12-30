const Events = require('discord.js');

// Match twitter, fxtwitter, or vxtwitter
const twit = new RegExp('https://(fx|vx|)twitter.com/\\S+/status/\\S+');
const fa = new RegExp('https://www.furaffinity.net/view/\\S+/');
const e6 = new RegExp('https://e621.net/posts/\\S+');

/**
 * Checks whether the given String is
 * @param {String} content
 * @returns True if the String is an art link
 */
function containsLink(content) {
	if (twit.test(content) || fa.test(content) || e6.test(content)) {
		return true;
	}
}

/**
 * Finds and returns the first art link in a string.
 *
 * @param {String} content Message content
 * @returns The first twitter, furaffinity, or e621 link in the
 * given string, or null.
 */
function grabLink(content) {
	if (twit.test(content)) {
		return twit.exec(content)[0];
		// TODO: convert plain twitter links to fxtwitter links
	}

	if (fa.test(content)) {
		return fa.exec(content)[0];
	}

	if (e6.test(content)) {
		return e6.exec(content)[0];
	}

	return null;
}

/**
 * Checks if a Message is a Twitter, Furaffinity, or e621
 * link and resends the link as a reply.
 *
 * @param {Message} msg a Discord Message
 */
function onTwitLinkSend(msg) {
	if (!msg.author.bot) {
		if (containsLink(msg.content)) {
			msg.channel.send(msg.content);
		}
	}
}

exports.onTwitLinkSend = onTwitLinkSend;
exports.containsLink = containsLink;
exports.grabLink = grabLink;