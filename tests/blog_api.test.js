const supertest = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

const api = supertest(app);
const { blogs, newTestBlog, newUser } = require('./BlogData');
const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Register Success');

  const blogObjects = blogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('testing Api requests', () => {
  it('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(blogs.length);
  }, 10000);

  it('should validate a blog has an id', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
    expect(response.body[3].id).toBeDefined();
  }, 10000);

  it('saving new blog', async () => {
    const response = await api
      .post('/api/users/login')
      .send({ username: 'test1', password: '123456' })
      .expect(200);

    expect(response.body.token).toBeDefined();

    await api
      .post('/api/blogs')
      .send(newTestBlog)
      .set({ Authorization: `Bearer ${response.body.token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response1 = await api.get('/api/blogs');

    expect(response1.body).toHaveLength(blogs.length + 1);
    expect(response1.body[blogs.length].title).toBe('Test');
  }, 10000);

  it('verify if likes property is missing then it defaults to 0', async () => {
    const response = await api
      .post('/api/users/login')
      .send({ username: 'test1', password: '123456' })
      .expect(200);

    expect(response.body.token).toBeDefined();

    await api
      .post('/api/blogs')
      .send(newTestBlog)
      .set({ Authorization: `Bearer ${response.body.token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response1 = await api.get('/api/blogs');

    expect(response1.body[blogs.length].likes).toBe(0);
  }, 10000);

  it('verify if url or title property is missing then return 400', async () => {
    const response = await api
      .post('/api/users/login')
      .send({ username: 'test1', password: '123456' })
      .expect(200);

    expect(response.body.token).toBeDefined();

    const badBlog = { author: 'Test1', likes: 25 };
    await api
      .post('/api/blogs')
      .send(badBlog)
      .set({ Authorization: `Bearer ${response.body.token}` })
      .expect(400)
      .expect('Content-Type', /application\/json/);
  }, 10000);
}, 100000);

describe('testing Api requests with specific id', () => {
  it('deleting blogs by using endpoint api/blogs/:id', async () => {
    const response = await api
      .post('/api/users/login')
      .send({ username: 'test1', password: '123456' })
      .expect(200);

    expect(response.body.token).toBeDefined();

    const blog = await api
      .post('/api/blogs')
      .send(newTestBlog)
      .set({ Authorization: `Bearer ${response.body.token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response1 = await api
      .delete(`/api/blogs/${blog.body.id}`)
      .set({ Authorization: `Bearer ${response.body.token}` });

    expect(response1.body.id).toBe(`${blog.body.id}`);
  });

  it('updating blogs by using endpoint api/blogs/:id', async () => {
    const response = await api
      .patch('/api/blogs/5a422a851b54a676234d17f7')
      .send({ likes: 10 });

    expect(response.body.likes).toBe(10);
  });
});

afterAll(() => {
  mongoose.connection.close();
  app.killServer();
});
