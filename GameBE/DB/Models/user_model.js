// models/User.js
import sequelize from '../dbClient.js'; // Kết nối đến cơ sở dữ liệu
import { DataTypes } from 'sequelize';



// Định nghĩa model User
export const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Tự động tăng
    },
    user_name: {
        type: DataTypes.STRING(255),
        allowNull: false, // Không cho phép null
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false, // Không cho phép null
        unique: true, // Đảm bảo email là duy nhất
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false, // Không cho phép null
    },
    role: {
        type: DataTypes.TINYINT,
        defaultValue: 0, // Mặc định là 0
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1, // 1: active, 0: inactive
      },
}, {
    tableName: 'users', // Tên bảng trong cơ sở dữ liệu
    timestamps: true, // Không tự động tạo các trường createdAt và updatedAt
});



