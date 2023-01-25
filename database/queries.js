/** Module for retrieving links from the database given an emote tag search key */
const { pool } = require('./pool');
const format = require('pg-format');
const { QResult, QError } = require('./q-objects.js');

/**
 * Queries the database table guildID for
 * rows that contain at least 1 count of the column
 * emoteID and returns them.
 *
 * @param {string} guildID ID of guild table to query.
 * @param {string} emoteID ID of emote column to query.
 * @returns {QResult} An Object detailing the result of the query.
 * @throws {QError} If a query error occurs, most likely due to
 * guildID not identifying an existing table or emoteID not identifying
 * an existing column in that table.
 */
async function select(guildID, emoteID) {
	let q = format('SELECT (link, %I) from %I WHERE %I > 0 ORDER BY %I DESC',
		emoteID, guildID, emoteID, emoteID);

	try {
		let r = await pool.query(q);
		let rows = cleanRows(r.rows, emoteID);
		return new QResult(rows, r.rowCount);
	}
	catch (err) {
		throw new QError(err);
	}
}

/**
 * Parses the string members of an array of objects
 * returned from a select query into a cleaner object
 * form containing the artlink, emoteCount, and emoteID.
 *
 * @param {Array} rows Array of objects with row string fields.
 * @param {string} emoteid ID of emote that was queried.
*/
function cleanRows(rows, emoteid) {
	let items = [];
	rows.map(item => {
		let str = item.row;
		str = str.replace('(', '');
		str = str.replace(')', '');
		str = str.split(',');

		items.push ({
			'link' : str[0],
			'emoteCount' : parseInt(str[1]),
			'emoteID' : emoteid,
		});
	});

	return items;
}

// TODO: remove select() call
// select('artlinks', 'emoji1').then(res => {
// 	console.log(res);
// }).catch(err => {
// 	console.log(err);
// });

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
// insert('artlinks', 'emoji69', 'www.iamalinklookatme.com').then(res => {
// 	console.log(res);
// }).catch(err => {
// 	console.log(err);
// });


exports.select = select;
exports.insert = insert;