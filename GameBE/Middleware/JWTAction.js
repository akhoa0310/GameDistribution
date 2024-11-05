import jwt, { decode } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Hàm middleware kiểm tra tính hợp lệ của JWT
export const verifyToken = (token) => {
  let key = process.env.JWT_SECRET_KEY;
  let decoded=null;

  try {
    decoded = jwt.verify(token,key);
  }catch(error){
    console.log(error);
  }
  return decoded;

};
export const checkUseJWT = (req, res, next) => {
  let cookies = req.cookies;
  if (cookies && cookies.jwt) {
    let token = cookies.jwt;
    let decoded = verifyToken(token);
    console.log(token);
    console.log(decoded);
    if (decoded) {
      req.user = decoded;
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

