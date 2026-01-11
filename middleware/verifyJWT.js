const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access Denied: No Token Provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).json({ message: 'Access Denied: Invalid Token' });
    }
    req.user = { username: decoded.username, id: decoded.id };
    next();
  });
}

module.exports = verifyJWT;
