const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controller/postController');
const verifyJWT = require('../middleware/verifyJWT');
const multer = require('multer');
const upload = require('../middleware/upload');

router.post('/', upload.single('file'), createPost);
router.get('/', getPosts);

module.exports = router;
