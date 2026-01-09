const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./middleware/connectDB');
const User = require('./models/userModel');
const port = process.env.PORT || 4000;

// initialize express app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// database connection
connectDB();

// api endpoint for user registration
app.post('/api/v1/register', async (req, res) => {
  // extract username and password from request body
  const { username, password } = req.body;
  // basic validation for username and password
  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // check if user already exists
  const user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ message: 'User already exists' });
  }
  // hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // create new user
  const newUser = await User.create({ username, password: hashedPassword });
  // send a response
  res.status(201).json({
    message: 'User registered successfully',
    user: { id: newUser._id, username: newUser.username },
  });
});

app.post('/api/v1/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.status(200).json({
    message: 'Login successful',
    user: { id: user._id, username: user.username },
  });
});

// start the server by listening on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
