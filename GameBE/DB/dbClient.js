// dbClient.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
  
// Tải các biến môi trường từ file .env
dotenv.config();

// Khởi tạo Sequelize với thông tin kết nối từ biến môi trường
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql', 
    }
);

export default sequelize;
