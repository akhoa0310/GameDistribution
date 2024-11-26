// models/GameHistory.js
import { DataTypes } from 'sequelize';
import sequelize from '../dbClient.js'; // Kết nối đến cơ sở dữ liệu
import { Game } from './game_model.js';
import { User } from './user_model.js';
// Định nghĩa model GameHistory
export const GameHistory = sequelize.define('GameHistory', {
    history_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Tự động tăng nếu cần thiết
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Có thể là null
        references: {
            model: 'users', // Tên bảng tham chiếu
            key: 'user_id', // Khóa chính của bảng tham chiếu
        },
    },
    game_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Có thể là null
        references: {
            model: 'games', // Tên bảng tham chiếu
            key: 'game_id', // Khóa chính của bảng tham chiếu
        },
    },
    played_time: {
        type: DataTypes.DATEONLY, // Định dạng ngày
        allowNull: true, // Có thể là null
    },
}, {
    tableName: 'game_history', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không tự động tạo các trường createdAt và updatedAt
});
GameHistory.belongsTo(User, { foreignKey: 'user_id' }); // Lịch sử chơi thuộc về một user
GameHistory.belongsTo(Game, { foreignKey: 'game_id' }); // Lịch sử chơi thuộc về một game
