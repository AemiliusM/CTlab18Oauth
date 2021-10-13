const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('CTlab18OAuth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
 
  it('Should GET /api/v1/auth/login and redirect to github for login', async () => {
    const response = await request(app).get('/api/auth/login');

    expect(response.body).toEqual({
      login: 'fake_user',
      avatar: 'github_avatar_url', 
      // iat: Date.now(),
      // exp: Date.now(),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
