const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./middleware/connectDB');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const multer = require('multer');
const port = process.env.PORT || 4000;

// initialize express app
const app = express();

const corsOption = {
  origin: ['http://localhost:5173', 'https://remnets.netlify.app'],
  credentials: true,
};
// middlewares
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// database connection
connectDB();

// api endpoint for authentication routes
app.get('/', (req, res) => {
  return res.json({ done: 'Alright' });
});
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/posts', postRoute);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Max size is 10MB',
      });
    }

    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Max is 5 files',
      });
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field in file upload',
      });
    }
  }

  res.status(500).json({
    success: false,
    message: error.message,
  });
});

// start the server by listening on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
