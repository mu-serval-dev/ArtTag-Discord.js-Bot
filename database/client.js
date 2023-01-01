// Module containing pg database client

const pg = require('pg');
const { dbstring } = require('../config.json');
const pgClient = new pg.Client(dbstring);
pgClient.connect();

pgClient.query('SELECT * from artlinks').then(result => {
	console.log(result.rows);
});

pgClient.query('SELECT emoji1 from artlinks').then(result => {
	console.log(result.rows);
	pgClient.end();
});


// exports.pgClient = pgClient;