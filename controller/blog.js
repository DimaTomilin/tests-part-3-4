const Blog = require('../models/blog');
const User = require('../models/user');

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().populate('user', { username: 1, name: 1 });
  res.send(blogs);
};

const createNewBlog = async (req, res) => {
  const { title, author, url, likes } = req.body;
  const user = await User.findById(req.user.id);
  const blog = new Blog({ title, author, url, likes, user: user._id });

  const newBlog = await blog.save();
  await User.findByIdAndUpdate(
    { _id: req.user.id },
    { $push: { blogs: newBlog._id } }
  );

  console.log('creating blog', newBlog);
  res.status(201).send(newBlog);
};

const deleteBlog = async (req, res) => {
  const _id = req.params.id;

  const blog = await Blog.findOne({ _id });
  if (blog.user.toString() === req.user.id) {
    await User.deleteOne({ _id });
    res.send(blog);
  } else {
    res
      .status(403)
      .send({ error: 'You can`t delete blog that you didn`t create' });
  }
};

const updateBlog = async (req, res) => {
  const id = req.params.id;
  const { likes } = req.body;
  const blog = await Blog.findOneAndUpdate({ id }, { likes }, { new: true });

  res.send(blog);
};

module.exports = { getAllBlogs, createNewBlog, deleteBlog, updateBlog };
