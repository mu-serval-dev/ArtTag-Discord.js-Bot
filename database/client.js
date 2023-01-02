// Module containing pg database client

const pg = require('pg');
const { dbstring } = require('../config.json');
const pgClient = new pg.Client(dbstring);

pgClient.connect();

const selectQuery = 'SELECT (link, $1) FROM artlinks ORDER BY ($1) DESC';
const values = ['emoji3', 'artlinks'];

pgClient.query(selectQuery, values).then(result => {
	console.log(result.rows);
});

pgClient.query('SELECT emoji1 from artlinks').then(result => {
	console.log(result.rows);
	pgClient.end();
});


// exports.pgClient = pgClient;