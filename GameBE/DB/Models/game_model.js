// models/Game.js
import { DataTypes } from 'sequelize';
import sequelize from '../dbClient.js'; // Kết nối đến cơ sở dữ liệu
import { User } from './user_model.js'; // Nhập mô hình User


// Định nghĩa model Game
export const Game = sequelize.define('Game', { 
    game_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Tự động tăng nếu cần thiết
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Có thể là null
        references: {
            model: User, // Tham chiếu đến model User
            key: 'user_id', // Khóa chính của bảng tham chiếu
        },
    },
    game_name: {
        type: DataTypes.STRING(255),
        allowNull: true, // Có thể là null
    },
    game_description: {
        type: DataTypes.TEXT,
        allowNull: true, // Có thể là null
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true, // Có thể là null
    },
    date_release: {
        type: DataTypes.DATEONLY, // Định dạng ngày
        allowNull: true, // Có thể là null
    },
    player_count: {
        type: DataTypes.INTEGER,
        allowNull: true, // Có thể là null
    },
    player_number: {
        type: DataTypes.STRING,
        allowNull: true, // Có thể là null
    },
    genres: {
        type: DataTypes.STRING(255),
        allowNull: true, // Có thể là null
    },
    file_path: {
        type: DataTypes.STRING(255),
        allowNull: true, // Có thể là null
    },
    image_file_path: {
        type: DataTypes.STRING(255),
        allowNull: true, // Có thể là null
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1, // 1: active, 0: inactive
      },
}, {
    tableName: 'games', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không tự động tạo các trường createdAt và updatedAt
});

// Thiết lập mối quan hệ giữa Game và User
Game.belongsTo(User, {
    foreignKey: 'user_id', // Khóa ngoại trong bảng Game
});
