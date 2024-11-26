
import { DataTypes } from 'sequelize';
import sequelize from '../dbClient.js'; // Kết nối đến cơ sở dữ liệu
import { Game } from './game_model.js';
import { User } from './user_model.js';

// Định nghĩa model Comment
export const Comment = sequelize.define('Comment', {
    cmt_id: {
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
    time: {
        type: DataTypes.DATE, // Thời gian bao gồm cả ngày và giờ
        allowNull: true, // Có thể là null
    },
    content: {
        type: DataTypes.TEXT, // Nội dung comment
        allowNull: true, // Có thể là null
    },
}, {
    tableName: 'comments', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không tự động tạo các trường createdAt và updatedAt
});

// Thiết lập quan hệ với bảng `User` và `Game`
Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Game, { foreignKey: 'game_id' });
