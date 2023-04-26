const request = require('supertest');
const app = require(base('main/app'));
const connection = require(base("main/connection"));
const User = require(base('app/models/User'));

describe('Auth', () => {
  beforeAll(async () => {
    await connection;
    const user = await User.factory().create();
    var token = user.createToken();
  });

  it('should register a user', async () => {
    const user = {
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: 'password456'
    };
    const response = await request(app).post('/api/auth/register').send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should get user details', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
    expect(response.body.name).toBe('John Doe');
    expect(response.body.email).toBe('johndoe@example.com');
  });

  it('should not get user details without token', async () => {
    const response = await request(app).get('/api/auth/profile');
    expect(response.statusCode).toBe(401);
  });

  it('should not get user details with invalid token', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalidtoken');
    expect(response.statusCode).toBe(401);
  });
});