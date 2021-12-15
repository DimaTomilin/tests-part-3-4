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
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

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

  it('verify if url or title property is missing then return 400', async () => {
    const badBlog = { author: 'Test1', likes: 25 };
    await api
      .post('/api/blogs')
      .send(badBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('testing Api requests with specific id', () => {
  it('deleting blogs by using endpoint api/blogs/:id', async () => {
    const response = await api.delete('/api/blogs/5a422a851b54a676234d17f7');

    expect(response.body.id).toBe('5a422a851b54a676234d17f7');

    const response2 = await api.get('/api/blogs');

    expect(response2.body).toHaveLength(blogs.length - 1);
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
