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

const deleteBlog = async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findOneAndDelete({ id });

  res.send(blog);
};

const updateBlog = async (req, res) => {
  const id = req.params.id;
  const { likes } = req.body;
  const blog = await Blog.findOneAndUpdate({ id }, { likes }, { new: true });

  res.send(blog);
};

module.exports = { getAllBlogs, createNewBlog, deleteBlog, updateBlog };
