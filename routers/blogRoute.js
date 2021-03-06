const express = require('express');
const router = express.Router();

const {
  getAllBlogs,
  createNewBlog,
  deleteBlog,
  updateBlog,
} = require('../controller/blog');

const { authToken } = require('../utils/middleware');

router.get('/', getAllBlogs);
router.post('/', authToken, createNewBlog);
router.delete('/:id', authToken, deleteBlog);
router.put('/:id', authToken, updateBlog);

module.exports = router;
