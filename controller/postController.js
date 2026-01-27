const fs = require('fs').promises;
const { put, del } = require('@vercel/blob');
const path = require('path');
const Post = require('../models/postModel');
const { log } = require('console');

const createPost = async (req, res) => {
  try {
    const { title, summary, content } = req.body;

    // validate required fields
    // if (!title || !summary) {
    //   // delete uploaded file if validation fails
    //   if (req.file) {
    //     await fs.unlink(req.file.path);
    //   }
    //   return res.status(400).json({ message: 'All fields are mandatory' });
    // }

    // const cover = req.file ? `/uploads/${req.file.filename}` : null;

    const filename = `${Date.now()}-${req.file.originalname}`;
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      // token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: req.file.mimetype,
    });
    // console.log(blob.url);

    const post = await Post.create({
      title,
      summary,
      content,
      cover: blob.url,
      author: req.user.id,
    });
    res.status(201).json(post);
  } catch (error) {
    // if (req.file) {
    //   try {
    //     await fs.unlink(req.file.path);
    //   } catch (unlinkError) {
    //     console.error('Error deleting file:', unlinkError);
    //   }
    // }
    res.status(500).json({ Message: error.message });
  }
};

const getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate('author', ['username'])
    .sort({ createdAt: -1 })
    .limit(20);
  res.status(200).json(posts);
};

const getPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate('author', ['username']);
  res.json(post);
};

// upload post with optional file upload
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content } = req.body;

    const post = await Post.findById(id);

    // if (!post) {
    //   if (req.file) {
    //     await fs.unlink(req.file.path);
    //   }
    //   return res.status(404).json({ message: 'Post not found' });
    // }

    // update fields
    post.title = title || post.title;
    post.summary = summary || post.summary;
    post.content = content || post.content;

    // handle file replacement
    if (req.file) {
      // Delete old file if exist
      if (post.cover) {
        await del(post.cover, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        // const oldFilePath = path.join(__dirname, '..', post.cover);
        // // console.log(oldFilePath);
        // try {
        //   await fs.unlink(oldFilePath);
        // } catch (error) {
        //   console.error('Error deleting old file: ', error);
        // }
      }
      const filename = `${Date.now()}-${req.file.originalname}`;
      const blob = await put(filename, req.file.buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: req.file.mimetype,
      });
      post.cover = blob.url;
      // post.cover = `/uploads/${req.file.filename}`;
    }
    // updates current post
    await post.save();

    res.status(200).json({ message: 'Post updated successfully', data: post });
  } catch (error) {
    // if (req.file) {
    //   await fs.unlink(req.file.path);
    // }
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // get post with id
    const post = await Post.findById(id);
    // if post does not exist, return a 404
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Delete associated file
    if (post.cover) {
      await del(post.cover, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      // const filePath = path.join(__dirname, '..', post.cover);
      // // console.log(filePath);
      // try {
      //   await fs.unlink(filePath);
      // } catch (error) {
      //   console.error('Error deleting file: ', error);
      // }
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getPosts, getPost, updatePost, deletePost };
