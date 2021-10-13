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
  };
});

describe('CTlab18OAuth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('Should GET /api/auth/me -- users profile page ', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.body).toEqual({
      login: 'fake_user',
      avatar: 'https://example.com/image.png',
      iat: Date.now(),
      exp: Date.now(), 
    });
    
  });

  afterAll(() => {
    pool.end();
  });
});
