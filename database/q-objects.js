/**
 * Object returned when a PostGres Database
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
	}
}

/**
 * Object thrown when an error is encountered
 * while querying a PostGres Database.
 */
class QError {
	/**
	 *
	 * @param {string} message
	 * @param {string} brief
	 * @param {number} code
	 */
	constructor(message, brief, code) {
		this.message = message;
		this.brief = brief;
		this.code = code;
	}
}

exports.QResult = QResult;
exports.QError = QError;