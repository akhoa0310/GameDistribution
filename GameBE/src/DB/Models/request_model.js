import sequelize from '../dbClient.js'; // Kết nối đến cơ sở dữ liệu
import { DataTypes } from 'sequelize';
import { User } from './user_model.js'; // Import model User

// Định nghĩa model Request
export const Request = sequelize.define('Request',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Tự động tăng
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Không cho phép null
      references: {
        model: 'users', // Tên bảng users
        key: 'user_id', // Liên kết với khóa chính của bảng users
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending', // Giá trị mặc định là 'pending'
      allowNull: false, // Không cho phép null
    },
    reason: {
      type: DataTypes.STRING, // Trường lý do
      allowNull: true, // Có thể để trống
    },
  },
  {
    tableName: 'requests', // Tên bảng trong cơ sở dữ liệu
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Thiết lập mối quan hệ giữa Request và User
Request.belongsTo(User, { foreignKey: 'user_id', as: 'user' }); // Một Request thuộc về một User
// User.hasMany(Request, { foreignKey: 'userId', as: 'requests' }); // Một User có nhiều Request
