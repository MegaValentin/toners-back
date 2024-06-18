export const verifyRole = (role) => {
    return (req, res, next) => {
        console.log(req.user.role);
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };