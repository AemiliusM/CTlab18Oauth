const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const { post } = require('superagent');
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

const postUser = {
  userId: '1',
  photoUrl: 'https://example.com/image.png',
  caption: 'This some lovely caption from the bottom of my heart :)',
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

  afterAll(() => {
    pool.end();
  });
});
