const pool = require('../utils/pool.js');
const jwt = require('jsonwebtoken');

module.exports = class Gram {
    id;
    photoUrl;
    userId;
    caption;
    

    constructor(row) {
        this.id = row.id;
        this.photoUrl = row.photo_url;
        this.userId = row.user_id;
        this.caption = row.caption;
    }
    /// more static stuff ...

    static async post({userId, photoUrl, caption }) {
        console.log(userId);
        const { rows } = await pool.query(
        'INSERT INTO posts ( user_id, photo_url, caption) VALUES ($1, $2, $3) RETURNING *;', [userId, photoUrl, caption ]
        );
        return new Gram(rows[0]);
      }

      static async getAll() {
        const { rows } = await pool.query('SELECT * FROM posts;')
        return new Gram(rows[0]);
    }

}