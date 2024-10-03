const quips = [
	'Here ya go!',
	'I\'ll get that for ya!',
	'Just a sec!',
	'On it!',
];
// TODO: be creative; add bold, italics, etc for fun

/**
 * Retrieve a random quip to use in response
 * when executing a command.
 *
 * @returns A string quip
 */
function getQuip() {
	const index = Math.floor(Math.random() * quips.length);
	return quips[index];
}

exports.getQuip = getQuip;