const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
} = require('../controller/postController');
const verifyJWT = require('../middleware/verifyJWT');
const multer = require('multer');
const upload = require('../middleware/upload');

router.post('/', verifyJWT, upload.single('file'), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);

module.exports = router;
