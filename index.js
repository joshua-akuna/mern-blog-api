const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./middleware/connectDB');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const port = process.env.PORT || 4000;

// initialize express app
const app = express();

// middlewares
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());

// database connection
connectDB();

// api endpoint for authentication routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/post', postRoute);

// start the server by listening on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
