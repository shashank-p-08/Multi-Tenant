import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authenticate = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    // decoded contains user_id, tenant_id, role
    req.user = decoded;
    next();
  } catch (error) {

    console.error('Auth Error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export default authenticate;

