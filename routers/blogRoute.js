const express = require('express');
const router = express.Router();

const {
  getAllBlogs,
  createNewBlog,
  deleteBlog,
  updateBlog,
} = require('../controller/blog');

router.get('/', getAllBlogs);
router.post('/', createNewBlog);
router.delete('/:id', deleteBlog);
router.patch('/:id', updateBlog);

module.exports = router;
