const twit = new RegExp('https://(fx|vx|)twitter.com/\\S+/status/\\S+');

/**
 * Finds and returns the first art post link in a string.
 *
 * NOTE: vxtwitter, fxtwitter, and twitter links are all valid, but
 * the returned link will be an fxtwitter link.
 *
 * @param {String} content Message content
 * @returns The first art post link in the given string.
 */
function parseLink(content) {
	if (twit.test(content)) {
		let link = twit.exec(content)[0];

		// vxtwitter --> fxtwitter
		if (link.includes('vx')) {
			link = link.replace('vx', 'fx');
		}
		// twitter --> fxtwitter
		else if (!link.includes('fx')) {
			link = link.replace('twitter', 'fxtwitter');
		}

		return link;
	}

	return null;
}

exports.parseLink = parseLink;