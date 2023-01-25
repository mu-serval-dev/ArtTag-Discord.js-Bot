/** Module for inserting to/updating the database when a new emote reaciton is added to an art post link */
const { pool } = require('./client');
const format = require('pg-format');
const { QError, QResult } = require('./q-objects');

// TODO: add jsdoc tag
async function insert(guildID, emoteID, link) {
	let q = format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS %I INTEGER NOT NULL DEFAULT 0',
		guildID, emoteID);

	try {
		let client = await pool.connect();
	}
	catch (err) {
		throw new QError('a', 'a', 0);
	}
}

insert('artlinks', 'emoji1', 'www.iamalinklookatme.com').then(res => {
	console.log(res);
}).catch(err => {
	// TODO
	console.log(err);
});

exports.insert = insert;