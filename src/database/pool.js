// Module containing pg database pool
const { dbobj } = require('../../config.json');
const { Pool } = require('pg');
const pool = new Pool(dbobj);

// TODO: change to .ts, use CTRL+SHIFT+B to run build task to
// turn anything .ts/ files in src into js files in build/

exports.pool = pool;