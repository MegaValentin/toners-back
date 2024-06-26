import jwt from 'jsonwebtoken'
import User from '../models/users.model.js';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = async (req, res, next) => {
    const { token } = req.cookies;
  
    if (!token) return res.status(401).json({ message: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, TOKEN_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) return res.status(401).json({ message: "Unauthorized" });
  
      req.user = user;
      console.log('User in verifyToken:', req.user); // Agrega este log
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };