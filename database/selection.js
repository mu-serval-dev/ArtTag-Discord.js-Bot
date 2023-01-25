/** Module for retrieving links from the database given an emote tag search key */
const { pool } = require('./client');
const format = require('pg-format');
const { QResult, QError } = require('./q-objects.js');

/**
 * Queries the database table given by serverid for
 * rows that contain at least 1 count of the given
 * emoteid.
 *
 * @param {string} emoteid
 * @param {string} serverid
 */
async function select(emoteid, serverid) {
	let q = format('SELECT (link, %I) from %I WHERE %I > 0 ORDER BY %I DESC',
		emoteid, serverid, emoteid, emoteid);

	try {
		let r = await pool.query(q);
		return new QResult(r.rows, r.rowCount);
	}
	catch (err) {
		let end = err.stack.indexOf('\n');
		let brief = err.stack.substring(7, end);
		let message = 'Error ' + err.code + ': ' + brief;

		throw new QError(message, brief, parseInt(err.code));
	}
}

// TODO: remove select() call
select('emoji1', 'artlinks').then(res => {
	console.log(res);
	pool.end();
}).catch(err => {
	console.log(err);
	console.log(err.message);
	pool.end();
});


exports.select = select;