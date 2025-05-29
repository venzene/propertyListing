const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret'; 

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.isAuthenticated = false;
    res.locals.isAuthenticated = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    console.log('User ID from token:', req.userId);
    req.isAuthenticated = true;
    res.locals.isAuthenticated = true;
  } catch (err) {
    req.isAuthenticated = false;
    res.locals.isAuthenticated = false;
  }

  next();
};
