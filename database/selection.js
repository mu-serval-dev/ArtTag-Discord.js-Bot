/** Module for retrieving links from the database given an emote tag search key */
const { pool } = require('./client');
const format = require('pg-format');

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
		// TODO: make some parser function to clean up row strings
		return {
			'rows' : r.rows,
			'rowCount' : r.rowCount,
		};
	}
	catch (err) {
		let end = err.stack.indexOf('\n');
		let brief = err.stack.substring(7, end);
		let message = 'Error ' + err.code + ': ' + brief;

		throw {
			'message' : message,
			'brief' : brief,
			'code' : err.code,

		};
	}
}


select('emoji1', 'artlinks').then(res => {
	console.log(res);
	pool.end();
}).catch(err => {
	console.log(err);
	console.log(err.message);
	pool.end();
});

// TODO: make q result and q error object classes for clarity?
// select().then(res => {
// 	const items = [];
// 	res.rows.map(item => {
// 		let link = item['row'];
// 		link = link.replace('(', '');
// 		link = link.replace(')', '');
// 		link = link.split(',');
// 		items.push(link);
// 	});

// 	console.log(items);
// });


exports.select = select;