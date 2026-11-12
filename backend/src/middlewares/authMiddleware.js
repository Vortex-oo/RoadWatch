const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // In a real app, you might check cookies or the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    req.user = decoded; // Attach user payload (e.g., id, role) to request
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};