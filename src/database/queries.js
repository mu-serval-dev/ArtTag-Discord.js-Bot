/** Module for retrieving links from the database given an emote tag search key */
const { pool } = require('./pool');
const format = require('pg-format');
const  { schema } = require('../../config.json')
const { QResult, QError } = require('./q-objects.js');
const { user } = require('pg/lib/defaults');

// TODO: optimize these perhaps idk

/**
 * Queries the database table guildID for
 * rows that contain at least 1 count of the column
 * emoteID and returns them.
 *
 * @param {string} guildID ID of the server whose table must be queried.
 * @param {string} emoteID ID of emote column to query.
 * @returns {QResult} An Object detailing the result of the query.
 * @throws {QError} If a query error occurs, most likely due to
 * guildID not identifying an existing table or emoteID not identifying
 * an existing column in that table.
 */
async function select(guildID, emoteID) {
	let q = format('SET SCHEMA %L', schema);

	try {
		let r = await pool.query(q);

		q = format('SELECT (link, %I) from %I WHERE %I > 0 ORDER BY %I DESC',
		emoteID, guildID, emoteID, emoteID);
		r = await pool.query(q);

		let rows = cleanRows(r.rows, emoteID);
		return new QResult(rows, r.rowCount);
	}
	catch (err) {
		throw new QError(err);
	}
}

/**
 * Parses the string rows returned from a select query into 
 * a cleaner object form containing the artlink, emoteCount, 
 * and emoteID.
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
 * Runs a transaction to increment the counter for the emoteID
 * column by 1 for the row containing link in the table specified by
 * guildID.
 *
 * If emoteID does not already identify a column in the table,
 * one is created.
 * 
 * If there is no row with the given link already, one is inserted.
 *
 * @param {string} guildID ID of the guild where this reaction took place.
 * @param {string} emoteID Emote to increment count by 1.
 * @param {string} link Link to store.
 * @returns {QResult} The transaction's result.
 * @throws {QError} If a query error occurs during the transaction.
 */
async function insert(guildID, emoteID, link) {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		let q = format('SET SCHEMA %L', schema); // boilerplate
		let res = await client.query(q);

		// Preemptively create user's artlink table if it doesn't exist
		q = format('CREATE TABLE IF NOT EXISTS %I (link varchar PRIMARY KEY)', guildID);
		res = await client.query(q);

		// Add new counter column for emote if it doesn't exist
		q = format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS %I INTEGER NOT NULL DEFAULT 0',
			guildID, emoteID);
		res = await client.query(q);

		// Insert row with link if it is not already in the table
		q = format('INSERT INTO %I(link) VALUES (%L) ON CONFLICT DO NOTHING',
			guildID, link);
		res = await client.query(q);

		// Increment the new emote counter for that link's row
		q = format('UPDATE %I SET %I = %I + 1 WHERE link = %L',
			guildID, emoteID, emoteID, link);
		res = await client.query(q);

		await client.query('COMMIT');

		return new QResult(res.rows, res.rowCount);
	}
	catch (err) {
		await client.query('ROLLBACK');
		throw new QError(err);
	}
	finally {
		client.release();
	}
}


// TODO: remove example insert() call
// insert('274290974153244677', 'emoji1', 'www.iamalinklookatme.com').then(res => {
// 	console.log(res);
// }).catch(err => {
// 	console.log(err);
// });


exports.select = select;
exports.insert = insert;