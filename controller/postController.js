const fs = require('fs').promises;
const path = require('path');
const Post = require('../models/postModel');

const createPost = async (req, res) => {
  try {
    const { title, summary, content } = req.body;

    // validate required fields
    if (!title || !summary) {
      // delete uploaded file if validation fails
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const cover = req.file ? `/uploads/${req.file.filename}` : null;
    const post = await Post.create({ title, summary, content, cover });
    res.status(201).json(post);
  } catch (error) {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(500).json({ Message: error.message });
  }
};

const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
};

module.exports = { createPost, getPosts };
