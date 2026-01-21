const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} = require('../controller/postController');
const verifyJWT = require('../middleware/verifyJWT');
const upload = require('../middleware/upload');

router.post('/', verifyJWT, upload.single('file'), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', verifyJWT, upload.single('file'), updatePost);
router.delete('/:id', verifyJWT, deletePost);

module.exports = router;
