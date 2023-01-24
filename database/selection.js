/** Module for retrieving links from the database given an emote tag search key */
const { pool } = require('./client');
const format = require('pg-format');
// TODO: handle possible errors
// 1. A provided emote is not in the database
// 2. There is no artlink with the given emote tag in the database
// Note: 2 should technically not be possible with how insertions are handled, but it might
// be nice to handle in the case deletions/decrements are added later


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
	finally {
		// TODO: remove this
		pool.end();
	}
}


select('emoji1', 'artlinst').then(res => {
	console.log(res);
}).catch(err => {
	console.log(err);
	console.log(err.message);
});
// const selectQuery = format('SELECT (link, %I) FROM %I WHERE %I > 0 ORDER BY %I DESC', 'emoji1', 'artlinks', 'emoji1', 'emoji1');
// console.log(selectQuery);

// async function select() {

// 	let res;

// 	try {
// 		let r = await pool.query(selectQuery);
// 		res = {
// 			rows : r.rows,
// 		};
// 	}
// 	catch (err) {
// 		const end = err.stack.indexOf('\n');
// 		const errMessage = err.stack.substring(7, end);
// 		console.log('Error ' + err.code + ':', errMessage);
// 		res = {
// 			message : errMessage,
// 			code : err.code,
// 		};

// 	}

// 	// pool.end();
// 	return res;

// }

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