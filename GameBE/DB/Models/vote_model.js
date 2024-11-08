// models/Vote.js
import { DataTypes } from 'sequelize';
import sequelize from '../dbClient.js'; // Kết nối đến cơ sở dữ liệu
import { Game } from './game_model.js';
import { User } from './user_model.js';

// Định nghĩa model Vote
export const Vote = sequelize.define('Vote', {
  vote_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'games',
      key: 'game_id',
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5, // Giới hạn đánh giá từ 1 đến 5 sao
    },
  },
  time: {
    type: DataTypes.DATE, // Thời gian đánh giá
    allowNull: true,
  },
}, {
  tableName: 'votes',
  timestamps: false, // Không tự động tạo các trường createdAt và updatedAt
});

// Thiết lập quan hệ với bảng `User` và `Game`
Vote.belongsTo(User, { foreignKey: 'user_id' });
Vote.belongsTo(Game, { foreignKey: 'game_id' });
