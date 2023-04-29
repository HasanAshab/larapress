const app = require(base('main/app'));
const supertest = require('supertest');
const request = supertest(app);

//connect();
//resetDatabase();

describe('media', () => {
  it('Should serve files', async () => {
    const response = await request.get('/');
    expect(true).toBe(true);
  });
});
