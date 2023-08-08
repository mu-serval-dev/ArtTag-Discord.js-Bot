/**
 * Object returned when a Postgres Database
 * query is completed.
 */
class QResult {
	/**
	 * Initializes a QResult Object.
	 * @param {Array} rows Array representing rows returned from query.
	 * @param {number} rowCount Count of rows returned from query.
	 */
	constructor(rows, rowCount) {
		this.rows = rows;
		this.rowCount = rowCount;
		// TODO: add fields that matter for insertion transactions?
	}
}

/**
 * Object thrown when an error is encountered
 * while querying a Postgres Database.
 */
class QError {
	/**
	 * Initializes a QError Object.
	 * @param {Error} error PgError thrown during a pg query.
	 */
	constructor(error) {
		let end = error.stack.indexOf('\n');
		let brief = error.stack.substring(7, end);
		let message = 'Error ' + error.code + ': ' + brief;

		this.message = message;
		this.brief = brief;
		this.code = error.code;
	}
}

exports.QResult = QResult;
exports.QError = QError;