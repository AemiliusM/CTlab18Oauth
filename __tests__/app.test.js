const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/models/User-model.js');

jest.mock('../lib/middleware/ensureAuth.js', () => {
  return (req, res, next) => {
    req.user = {
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
    };
    next();
  };
});

const comment1 = {
  commentBy: '1',
  post: '1',
  comment: 'no comments, no comments'
};
const postUser = {
  userId: '1',
  photoUrl: 'https://example.com/image.png',
  caption: 'This some lovely caption from the bottom of my heart :)',
};

const postUser2 = {
  userId: '1',
  photoUrl: 'www.photo-example.png',
  caption: 'this is my best post ever!!!'
};
const postUser3 = {
  userId: '1',
  photoUrl: 'www.photo-example-24.png',
  caption: 'i love lamp'
};

describe('CTlab18OAuth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('Should GET /api/auth/me -- users profile page ', async () => {
    await User.insert({
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
    });
    const response = await request(app).get('/api/auth/me');

    expect(response.body).toEqual({
      id: '1',
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
    });
  });

  // first call insert method/ replace auth/me
  // then call a post request 
  
  it('Should POST to create a new user post', async () => {
    await User.insert({
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
    });
    return await request(app).post('/api/auth/posts').send(postUser)
      .then((res) => {
        expect(res.body).toEqual({
          ...postUser,
          id: '1',
          
        });
      });
  });

  it('should return all posts', async () => {
    await User.insert({
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
    });
    await request(app).post('/api/auth/posts').send(postUser);
    await request(app).post('/api/auth/posts').send(postUser2);
    await request(app).post('/api/auth/posts').send(postUser3);
    return await request(app).get('/api/auth/posts').then(res => {
      expect(res.body).toEqual({ ...postUser, id: '1' }, { ...postUser2, id: '2' }, { ...postUser3, id: '3' });
    });
  });

  it.only('Should POST to create a new user comment', async () => {
    await User.insert({
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
    });
    await request(app).post('/api/auth/posts').send(postUser);
    return await request(app).post('/api/auth/comments').send(comment1).then(res => {
      expect(res.body).toEqual({ ...comment1, id:'1' });
    });
      
          
  });
      
  it('should return a post by id', async () => {
    await User.insert({
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
    });
    await request(app).post('/api/auth/posts').send(postUser);
    await request(app).post('/api/auth/posts').send(postUser2);
    await request(app).post('/api/auth/posts').send(postUser3);
    await request(app).post('/api/auth/comments').send(comment1);
    return await request(app).get('/api/auth/posts/1').then(res => {
      expect(res.body).toEqual({ ...postUser, id: '1' }, { ...postUser2, id: '2' }, { ...postUser3, id: '3' });
    });
  });
});

      
afterAll(() => {
  pool.end();
});

