class QResult {
    constructor(rows, rowCount) {
        this.rows = rows;
        this.rowCount = rowCount;
    }
}

class QError {
    constructor(message, brief, code) {
        this.message = message;
        this.brief = brief;
        this.code = code;
    }
}

exports.QResult = QResult;
exports.QError = QError;