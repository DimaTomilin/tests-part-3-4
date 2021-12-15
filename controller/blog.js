const Blog = require('../models/blog');

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find({});
  res.send(blogs);
};

const createNewBlog = async (req, res) => {
  const blog = new Blog(req.body);

  const result = await blog.save();
  res.status(201).send(result);
};

module.exports = { getAllBlogs, createNewBlog };
