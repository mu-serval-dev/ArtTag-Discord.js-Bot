// Module containing pg database pool
const { dbobj } = require('../config.json');
const { Pool } = require('pg');
const pool = new Pool(dbobj);

exports.pool = pool;