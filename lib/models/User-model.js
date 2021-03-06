const pool = require('../utils/pool.js');
const jwt = require('jsonwebtoken');

module.exports = class User {
    id;
    login;
    avatar;

    constructor(row) {
        this.id = row.id
        this.login = row.github_login;
        this.avatar = row.github_avatar_url; 
    }

    static async insert({ login, avatar }) {
        const { rows } = await pool.query(
          'INSERT INTO users (github_login, github_avatar_url) VALUES ($1, $2) RETURNING *',
          [login, avatar]
        );
        return new User(rows[0]);
      }
    
      static async findByUserName(login) {
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE github_login = $1',
            [login]
        );
        // console.log('ROWS', rows);
        if (!rows[0]) return null;
        return new User(rows[0]);
      }

      authToken() {
        return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
          expiresIn: '24h',
        });
      }
    
      toJSON() {
        return {
          id: this.id,
          login: this.login,
          avatar: this.avatar
        };
      }

      
};