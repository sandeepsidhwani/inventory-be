const jwt = require('jsonwebtoken');
const SECRET_KEY = 'abcdbc2344';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);
  console.log('Incoming token:', token);
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
   if (err) {
    console.error('JWT verification failed:', err.message); // <--- THIS will help
    return res.sendStatus(403);
  }
  req.user = decoded;
  console.log('JWT decoded:', decoded);
  next();
  });
};

module.exports = authenticateToken;
