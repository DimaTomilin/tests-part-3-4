const express = require('express');
const router = express.Router();

const { getAllBlogs, createNewBlog } = require('../controller/blog');

router.get('/', getAllBlogs);
router.post('/', createNewBlog);

module.exports = router;
