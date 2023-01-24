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
		// TODO: make some parser function to clean up row strings
		// each row should contain link, emoteid, and count for emoteid
		let rows = cleanRows(r.rows, emoteid);
		return new QResult(rows, r.rowCount);
	}
	catch (err) {
		let end = err.stack.indexOf('\n');
		let brief = err.stack.substring(7, end);
		let message = 'Error ' + err.code + ': ' + brief;

		return new QError(message, brief, err.code);
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
		str = str.replace('(', ''); // Remove ()
		str = str.replace(')', '');
		str = str.split(',');
		
		items.push ({
			'link' : str[0],
			'emoteCount' : parseInt(str[1]),
			'emoteID' : emoteid
		})
	})

	return items;
}
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