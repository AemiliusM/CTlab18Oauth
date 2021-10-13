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
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('Should POST to create a new user post', async () => {
    const response = await request(app).get('/api/auth/me');
    await request(app).post('/api/auth/posts').send(postUser);

    expect(response.body).toEqual({
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

  afterAll(() => {
    pool.end();
  });
});
