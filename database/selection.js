/** Module for retrieving links from the database given an emote tag search key */

// TODO: handle possible errors
// 1. A provided emote is not in the database
// 2. There is no artlink with the given emote tag in the database
// Note: 2 should technically not be possible with how insertions are handled, but it might
// be nice to handle in the case deletions/decrements are added later

// TODO: add JSDoc comment
function select(emoteTag) {
	// TODO
}


exports.select = select;