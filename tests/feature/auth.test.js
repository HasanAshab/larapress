const app = require(base('main/app'));
const supertest = require('supertest');
const request = supertest(app);
const bcrypt = require('bcryptjs');
const User = require(base('app/models/User'));

connect();
//resetDatabase();
  
describe('Auth', () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await User.factory().create({ emailVerified: true });
    token = user.createToken();
  });
  
  it('should register a user', async () => {
    const response = await request
      .post('/api/auth/register')
      .field('name', 'hasan')
      .field('email', 't@gmail.com')
      .field('password', 'haomao.12')
      .field('password_confirmation', 'haomao.12')
      .attach('logo', fakeFile('image.png'));
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('token');
  });
  
  /*

  it('should register a user', async () => {
    const dummyUser = User.factory().dummyData();
    const response = await request
      .post('/api/auth/register')
      .field('name', dummyUser.name)
      .field('email', dummyUser.email)
      .field('password', dummyUser.password)
      .field('password_confirmation', dummyUser.password)
      .attach('logo', fakeFile('image.png'));
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('token');
  });
  
  it('should login a user', async () => {
    const response = await request
      .post('/api/auth/login')
      .field('email', user.email)
      .field('password', 'password');
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('token');
  });
  
  it('should login a user', async () => {
    const response = await request
      .post('/api/auth/login')
      .field('email', user.email)
      .field('password', 'password');
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('token');
  });

  it('should get user details', async () => {
    const response = await request
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.email).toBe(user.email);
  });
  
  it('should update user details', async () => {
    const newUserData = {
      name: 'changed',
      email: 'changed@gmail.com',
    }
    const response = await request
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .field('name', newUserData.name)
      .field('email', newUserData.email)
      .attach('logo', fakeFile('image.png'));
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.name).toBe(newUserData.name);
    expect(user.email).toBe(newUserData.email);
  });
  
  it('should change password', async () => {
    const passwords = {
      old: 'password',
      new: 'new-password',
    }
    const response = await request
      .put('/api/auth/password/change')
      .set('Authorization', `Bearer ${token}`)
      .field('old_password', passwords.old)
      .field('password', passwords.new)

    user = await User.findById(user._id);
    const passwordMatch = await bcrypt.compare(passwords.new, user.password)
    console
    expect(response.statusCode).toBe(200);
    expect(passwordMatch).toBe(true);
  });
  */
  
});
