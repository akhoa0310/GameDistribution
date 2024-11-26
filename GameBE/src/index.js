import express from 'express';
import dotenv from 'dotenv';
import sequelize from './DB/dbClient.js'; // Kết nối với database
import routers from './Routes/user_route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config(); // Tải các biến môi trường từ file .env

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL, // Thay thế bằng địa chỉ client của bạn
    credentials: true // Cho phép gửi cookie trong các yêu cầu từ client
  }));
// Middleware để parse dữ liệu JSON từ các request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Định nghĩa các routes
app.use('/api', routers);

// Cấu hình Express để phục vụ file tĩnh
app.use('/public', express.static(path.resolve('public')));

// Kết nối với cơ sở dữ liệu và khởi chạy server
const startServer = async () => {
    try {
        // Kiểm tra kết nối với cơ sở dữ liệu
        await sequelize.authenticate();
        console.log('Kết nối thành công đến cơ sở dữ liệu.');

        // Đồng bộ các models với cơ sở dữ liệu nếu cần thiết
        await sequelize.sync({ alter: false }).then(() => {
            console.log('Database & tables have been updated.');
        });
        // Khởi chạy server
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Server đang chạy trên cổng ${PORT}`);
        }); 
    } catch (error) {
        console.error('Không thể kết nối đến cơ sở dữ liệu:', error);
    }
};

// Gọi hàm để khởi động server
startServer();





