import { Router } from 'express';
const ensureAuth = require('../middleware/ensureAuth');
const UserService = require('../services/UserService');

const DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scopes=read:user`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    try {
      const user = await UserService.create(req.query.code);

      res.cookie('session', user.authToken(), {
        httpOnly: true,
        maxAge: DAY_IN_MS,
        secure: true,
      });

      res.send(user);
    } catch (error) {
      next(error);
    }
  })
  .get('/me', ensureAuth, (req, res, next) => {
    try {
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  });
