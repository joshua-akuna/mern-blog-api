const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// controller function for user login
const login = async (req, res) => {
  // extract username and password from request body
  const { username, password } = req.body;
  // basic validation for username and password
  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // check if user exists
  const user = await User.findOne({ username });
  // check if user does not exist or password is incorrect
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }
  // generate JWT token
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );
  // set the token in a cookie
  res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
  // send a response
  res.status(200).json({
    message: 'Login successful',
    user: { id: user._id, username: user.username },
  });
};

// controller function for user registration
const register = async (req, res) => {
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
};

// controller function for getting user profile
function profile(req, res) {
  res.status(200).json(req.user);
}

module.exports = { login, register, profile };
