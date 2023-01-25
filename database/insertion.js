/** Module for inserting to/updating the database when a new emote reaciton is added to an art post link */
const { pool } = require('./client');
const format = require('pg-format');
const { QError, QResult } = require('./q-objects');

/**
 * Runs a transaction to insert a new link in the
 * emoteID column of the table identified by guildID.
 * Increments the count of the emoteID column by 1
 * for the row of the given link.
 *
 * If emoteID does not already identify a column in the table,
 * one is created.
 *
 * @param {string} guildID Guild table to store link in.
 * @param {string} emoteID Emote to increment count by 1.
 * @param {string} link Link to store.
 * @returns {QResult} An Object detailing the result of the transaction.
 * @throws {QError} If a query error occurs during the transaction,
 * most likely due to guildID not identifying an existing table.
 */
async function insert(guildID, emoteID, link) {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		let q = format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS %I INTEGER NOT NULL DEFAULT 0',
			guildID, emoteID);
		let res = await client.query(q);

		q = format('INSERT INTO %I(link) VALUES (%L) ON CONFLICT DO NOTHING',
			guildID, link);
		res = await client.query(q);

		q = format('UPDATE %I SET %I = %I + 1 WHERE link = %L',
			guildID, emoteID, emoteID, link);
		res = await client.query(q);

		await client.query('COMMIT');

		// TODO: return new QResult
		return res;
	}
	catch (err) {
		await client.query('ROLLBACK');
		throw err;
		// TODO: throw new QError
	}
	finally {
		client.release();
	}
}

// NOTE: main source of err should be incorrect guildID, in which case a new table
// for the guild should be made
// TODO: remove example insert() call
insert('artlinks', 'emoji69', 'www.iamalinklookatme.com').then(res => {
	console.log(res);
}).catch(err => {
	console.log(err);
});

exports.insert = insert;