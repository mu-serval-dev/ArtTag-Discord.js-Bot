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
	pgClient.query(selectQuery).then(result => {
		console.log(result);
		pgClient.end();
		// TODO: make result obj
	}, err => {
		const end = err.stack.indexOf('\n');
		const errMessage = err.stack.substring(7, end);
		console.log('Error ' + err.code + ':', errMessage);
		pgClient.end();
		const res = {
			message : errMessage,
			code : err.code,
		};

		return res;
	});
}

select();
// pgClient.query(selectQuery, values).then(result => {
// 	console.log(result.rows);
// });

// pgClient.query('SELECT emoji1 from artlinks').then(result => {
// 	console.log(result.rows);
// 	pgClient.end();
// });


// exports.pgClient = pgClient;