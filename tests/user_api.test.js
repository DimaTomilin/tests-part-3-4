const supertest = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

const api = supertest(app);
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});
});

describe('testing creating user', () => {
  it('creating user', async () => {
    const newUser = {
      username: 'test1',
      name: 'test name',
      password: '123456',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Register Success');

    const response = await api.get('/api/users');

    expect(response.body).toHaveLength(1);
    expect(response.body[0].username).toBe('test1');
  });

  describe('try to create unvalid user', () => {
    it('try to create unvalid user without username', async () => {
      const newUser2 = {
        name: 'test name',
        password: '123456',
      };

      const response = await api.post('/api/users').send(newUser2).expect(400);

      expect(response.body.error).toBe(
        'User validation failed: username: Path `username` is required.'
      );
    });

    it('try to create unvalid user with short password', async () => {
      const newUser1 = {
        username: 'test1',
        name: 'test name',
        password: '12',
      };

      await api
        .post('/api/users')
        .send(newUser1)
        .expect(400)
        .expect('Invalid password');
    });

    it('try to create user with this name', async () => {
      const newUser = {
        username: 'test2',
        name: 'test name2',
        password: '123456',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Register Success');

      const response = await api.post('/api/users').send(newUser).expect(409);

      expect(response.body.error).toBe('User already exists');
    }, 100000);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
  app.killServer();
});
