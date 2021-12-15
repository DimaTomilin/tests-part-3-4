const supertest = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

const api = supertest(app);
const { blogs } = require('./BlogData');
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

  it('should validate a post has an id', async () => {
    const response = await api.get('/api/blogs');
    console.log(response.body);
    expect(response.body[0].id).toBeDefined();
    expect(response.body[3].id).toBeDefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
  app.killServer();
});
