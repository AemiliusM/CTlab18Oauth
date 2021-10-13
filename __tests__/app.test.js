const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

jest.mock('../lib/middleware/ensureAuth.js', () => {
  return (req, res, next) => {
    req.user = {
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
      iat: Date.now(),
      exp: Date.now(),
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
    const response = await request(app).get('/api/auth/me');

    expect(response.body).toEqual({
      id: '1',
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  // first call insert method/ replace auth/me
  // then call a post request 
  
  it('Should POST to create a new user post', async () => {
    await request(app).get('/api/auth/me');
    return await request(app).post('/api/auth/posts').send(postUser)
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          login: 'fake_user',
          avatar: 'https://example.com/image.png',
          iat: expect.any(Number),
          exp: expect.any(Number),
          userId: expect.any(String),
          photoUrl: expect.any(String),
          caption: expect.any(String),
        });
      });
  });

  afterAll(() => {
    pool.end();
  });
});
