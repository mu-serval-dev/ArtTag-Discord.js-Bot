/**
 * Object returned when a PostGres Database
 * query is completed.
 */
class QResult {
	/**
	 * Initializes a QResult Object.
	 * @param {Array} rows Array of objects with row string fields from query.
	 * @param {number} rowCount Count of rows returned from query.
	 */
	constructor(rows, rowCount) {
		this.rows = this.#cleanRows(rows);
		this.rowCount = rowCount;
	}
	
	/**
	 * Parses the string members of an array of objects
 	 * returned from a select query into a cleaner object
 	 * form containing the artlink, emoteCount, and emoteID.
 	 *
 	 * @param {Array} rows Array of objects with row string fields.
 	 * @param {string} emoteid ID of emote that was queried.
 	*/
	#cleanRows(rows, emoteid) {
		let items = [];
		rows.map(item => {
			let str = item.row;
			str = str.replace('(', '');
			str = str.replace(')', '');
			str = str.split(',');

			items.push ({
				'link' : str[0],
				'emoteCount' : parseInt(str[1]),
				'emoteID' : emoteid,
			});
		});

		return items;
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