// Match twitter, fxtwitter, or vxtwitter
const twit = new RegExp('https://(fx|vx|)twitter.com/\\S+/status/\\S+');
const fa = new RegExp('https://www.furaffinity.net/view/\\S+/');
const e6 = new RegExp('https://e621.net/posts/\\S+');

/**
 * Finds and returns the first art link in a string.
 *
 * @param {String} content Message content
 * @returns The first twitter, furaffinity, or e621 link in the
 * given string, or null.
 */
function parseLink(content) {
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

exports.parseLink = parseLink;