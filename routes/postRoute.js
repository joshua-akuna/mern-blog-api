const express = require('express');
const router = express.Router();
const { createPost } = require('../controller/postController');

router.post('/', createPost);

module.exports = router;
