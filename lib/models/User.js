const pool = require('../utils/pool.js');
const jwt = require('jsonwebtoken');

module.exports = class User {
    login;
    avatar;

    constructor(row) {
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
    
      static async findByUsername(login) {
        
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE github_login = $1',
            [login]
        );
        
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
          login: this.login,
          avatar: this.avatar,
        };
      }
};