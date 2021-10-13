const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const User = require('../models/User-model');
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
      // console.log('CALLBACK USER', user);
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
    // console.log('REQ USER', req.user);
    try {
      console.log('REQ USER', req.user);
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  })

  .post('/posts', ensureAuth, async (req, res, next) => {
    try {
      
      const postBodyObj = await User.post(req.user, req.body);
      console.log(postBodyObj);
      res.send(postBodyObj);
    } catch (error) {
      next(error);
    }
  });

