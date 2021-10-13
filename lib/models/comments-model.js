const pool = require('../utils/pool.js');
const jwt = require('jsonwebtoken');

module.exports = class Comments {
    id;
    commentBy;
    post;
    comment;

    constructor(row) {
        this.commentBy = row.comment_by;
        this.post = row.post;
        this.comment = row.comment;
    }
    /// more static stuff .
}