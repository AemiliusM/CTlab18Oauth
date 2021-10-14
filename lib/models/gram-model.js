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

    static async getById(id) {
        const {rows} = await pool.query(`
          SELECT posts.id, user_id, photo_url, caption, comment 
          FROM posts 
          LEFT JOIN users
          ON users.id = posts.user_id
          LEFT JOIN comments 
          ON comments.post = posts.id WHERE posts.id = $1`, [id]
        );
        return new Gram(rows[0]);
      }

}