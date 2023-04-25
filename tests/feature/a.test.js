const request = require("supertest");
const app = require(base("main/app"));

describe('Example', () => {
  it('foo', async () => {
    const response = await request(app).get('/api/auth/profile');
    expect(response.statusCode).toBe(401);
  });
  
});
