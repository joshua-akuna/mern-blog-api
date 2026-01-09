const express = require('express');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 4000;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

app.post('/api/v1/register', (req, res) => {
  const { username, password } = req.body;
  res.status(200).json({ username, password });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
