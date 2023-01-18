// Module containing pg database client

// const pg = require('pg');
const format = require('pg-format');
const { dbobj } = require('../config.json');
// const pgClient = new pg.Client(dbstring);
const { Pool } = require('pg');
const pool = new Pool(dbobj);

// pgClient.connect();

// TODO:
// plan how to format query results/errors -- make class for object to return? or just don't lol
// plan how to handle errors
// figure out how to export pgClient object

const selectQuery = format('SELECT (link, %I) FROM %I WHERE %I > 0 ORDER BY %I DESC', 'emoji1', 'artlinks', 'emoji1', 'emoji1');
console.log(selectQuery);

async function select() {

	let res;

	try {
		let r = await pool.query(selectQuery);
		res = {
			rows : r.rows,
		};
	}
	catch (err) {
		const end = err.stack.indexOf('\n');
		const errMessage = err.stack.substring(7, end);
		console.log('Error ' + err.code + ':', errMessage);
		res = {
			message : errMessage,
			code : err.code,
		};

	}

	// pgClient.end();
	pool.end();
	return res;

}

select().then(res => {
	const items = [];
	res.rows.map(item => {
		let link = item['row'];
		link = link.replace('(', '');
		link = link.replace(')', '');
		link = link.split(',');
		items.push(link);
	});

	console.log(items);
});


// exports.pgClient = pgClient;