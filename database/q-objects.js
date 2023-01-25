/**
 * Object returned when a PostGres Database
 * query is completed.
 */
class QResult {
	/**
	 *
	 * @param {Array} rows
	 * @param {number} rowCount
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