const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const User = require('../models/User-model');
const Gram = require('../models/gram-model');
const Comments = require('../models/comments-model');
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
  .get('/posts', ensureAuth, async (req, res, next) => {
    try {
      const posts = await Gram.getAll();
      res.send(posts);
    } catch (error) {
      next(error);
    }
  })
  .get('/me', ensureAuth, async (req, res, next) => {
    try {
      const me = await User.findByUserName(req.user.login);
      res.send(me);
    } catch (error) {
      next(error);
    }
  })
  .get('/posts/:id', ensureAuth, async (req, res, next) => {
    try {
      const postById = await Gram.getById(req.params.id);
      res.send(postById);
    } catch (error) {
      next(error);
    }
  })

  .post('/posts', ensureAuth, async (req, res, next) => {
    try {
      const postBodyObj = await Gram.post(req.body);
      res.send(postBodyObj);
    } catch (error) {
      next(error);
    }
  })

  .post('/comments', ensureAuth, async (req, res, next) => {
    try {
      const postBodyObj = await Comments.insert(req.body);
      res.send(postBodyObj);
    } catch (error) {
      next(error);
    }
  })
  .patch('/posts/:id', ensureAuth, async (req, res, next) => {
    try {
      const postBodyUpdateObj = await Gram.update(req.params.id, req.body);
      res.send(postBodyUpdateObj);
    } catch (error) {
      next(error);
    }
  })
  .delete('/posts/:id', ensureAuth, async (req, res, next) => {
    try {
      const deleteObj = await Gram.delete(req.params.id);
      console.log('params', req.params.id);
      res.send(deleteObj);
    } catch (error) {
      next(error);
    }
  });
