const supertest = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

const api = supertest(app);
const { blogs, newTestBlog } = require('./BlogData');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = blogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('testing Api requests', () => {
  it('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  it('there are 6 blogs', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(blogs.length);
  });

  it('should validate a blog has an id', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
    expect(response.body[3].id).toBeDefined();
  });

  it('saving new blog', async () => {
    await api
      .post('/api/blogs')
      .send(newTestBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(blogs.length + 1);
    expect(response.body[blogs.length].title).toBe('Test');
  });

  it('verify if likes property is missing then it defaults to 0', async () => {
    await api
      .post('/api/blogs')
      .send(newTestBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    expect(response.body[blogs.length].likes).toBe(0);
  });
});

afterAll(() => {
  mongoose.connection.close();
  app.killServer();
});
