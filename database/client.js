// Module containing pg database client

const pg = require('pg');
const format = require('pg-format');
const { dbstring } = require('../config.json');
const pgClient = new pg.Client(dbstring);

pgClient.connect();

// TODO:
// learn about promises
// use pg-promise?
// plan how to format query results/errors
// plan how to handle errors
// figure out how to export pgClient object

const selectQuery = format('SELECT (link, %I) FROM %I WHERE %I > 0 ORDER BY %I DESC', 'emoji3', 'artlinks', 'emoji3', 'emoji3');
console.log(selectQuery);

async function select() {

	let res;

	try {
		let r = await pgClient.query(selectQuery);
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

	pgClient.end();
	return res;

}

select().then(res => {
	let link = res.rows[1]['row'];
	link = link.replace('(', '');
	link = link.replace(')', '');
	link = link.split(',');
	console.log(link);
});


// exports.pgClient = pgClient;