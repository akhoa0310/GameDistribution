import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Hàm middleware kiểm tra tính hợp lệ của JWT
export const verifyToken = (token) => {
  let key = process.env.JWT_SECRET_KEY;
  let decoded = null;

  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};

// Middleware kiểm tra JWT và vai trò người dùng
export const checkUseJWT = (roles = []) => {
  return (req, res, next) => {
    let cookies = req.cookies;
    if (cookies && cookies.jwt) {
      let token = cookies.jwt;
      let decoded = verifyToken(token);
      if (decoded) {
        // Lưu thông tin user vào req
        req.user = decoded;
        console.log(decoded.role);
        // Kiểm tra vai trò
        if (roles.length && !roles.includes(decoded.role)) {
          return res.status(403).json({
            message: 'Forbidden. Access denied.'
          });
        }
        next();
      } else {
        return res.status(401).json({
          message: 'Unauthorized access. Invalid token.'
        });
      }
    } else {
      return res.status(401).json({
        message: 'Unauthorized access. Token not found.'
      });
    }
  };
};
