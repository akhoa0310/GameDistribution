import { User } from "../Models/user_model.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Khởi tạo dotenv để đọc các biến môi trường từ file .env
dotenv.config();

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Hàm so sánh mật khẩu
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Đăng ký người dùng mới
export const register = async (user_name, email, password) => {
  // Kiểm tra xem email đã tồn tại hay chưa
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('Email already registered');

  // Mã hóa mật khẩu
  const hashedPassword = await hashPassword(password);
  
  // Tạo người dùng mới với status mặc định là 1 (active)
  const newUser = await User.create({ user_name, email, password: hashedPassword, status: 1 });
  return newUser;
};

// Đăng nhập người dùng
export const login = async (email, password) => {
  // Tìm người dùng theo email và kiểm tra status
  const user = await User.findOne({ where: { email, status: 1 } });
  if (!user) throw new Error('User not found or inactive');

  // Kiểm tra mật khẩu
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  // Tạo JWT token với secret_key từ .env
  const token = jwt.sign(
    { id: user.user_id, user_name: user.user_name, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  return { token };
};

export const verifyToken = (token) => {
  if (!token) {
    throw new Error('Not authenticated');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return decoded;
};

// Hàm cập nhật tên hoặc email người dùng
export const updateUserNameOrEmail = async (userId, newUserName, newEmail) => {
  try {
    // Kiểm tra nếu có yêu cầu thay đổi email và email mới đã tồn tại
    if (newEmail) {
      const existingUser = await User.findOne({ where: { email: newEmail, user_id: { $ne: userId } } });
      if (existingUser) {
        return { success: false, message: 'Email này đã được sử dụng' };
      }
    }

    // Cập nhật tên hoặc email trong cơ sở dữ liệu
    const updateData = {};
    if (newUserName) updateData.user_name = newUserName;
    if (newEmail) updateData.email = newEmail;

    await User.update(updateData, { where: { user_id: userId } });
    return { success: true, message: 'Cập nhật thông tin thành công' };
  
  } catch (error) {
    return { success: false, message: 'Lỗi khi cập nhật thông tin' };
  }
};

// Cập nhật mật khẩu người dùng
export const updatePassword = async (user_id, oldPassword, newPassword) => {
  try {
    // Tìm người dùng theo ID
    const user = await User.findByPk(user_id);
    if (!user) {
      return { success: false, message: 'Người dùng không tồn tại' };
    }

    // So sánh mật khẩu cũ với mật khẩu trong database
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return { success: false, message: 'Mật khẩu cũ không đúng' };
    }

    // Băm mật khẩu mới và cập nhật
    const hashedPassword = await hashPassword(newPassword);
    await User.update({ password: hashedPassword }, { where: { user_id: user_id } });

    return { success: true, message: 'Đổi mật khẩu thành công' };
  } catch (error) {
    return { success: false, message: 'Lỗi khi cập nhật mật khẩu' };
  }
};

// Hàm lấy thông tin người dùng dựa trên ID
export const findUserInfoById = async (userId) => {
  try {
    const user = await User.findOne({ where: { user_id: userId, status: 1 } }); // Chỉ lấy người dùng có status là 1
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Trả về thông tin cần thiết
    return { success: true, data: { user_name: user.user_name, email: user.email, role: user.role, status: user.status } };
  } catch (error) {
    return { success: false, message: 'Server error' };
  }
};

// Hàm lấy tất cả người dùng từ cơ sở dữ liệu
export const getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'user_name', 'email', 'role', 'status'], // Chỉ lấy các trường cần thiết
      where: { status: 1 } // Chỉ lấy người dùng có status là 1
    });
    return { success: true, data: users };
  } catch (error) {
    return { success: false, message: 'Server error' };
  }
};

// Hàm cập nhật thông tin user theo ID
export const updateUser = async (id, userData) => {
  try {
    const { user_name, email, role, status, password } = userData;

    // Tìm user theo ID
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Kiểm tra nếu có cập nhật email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email is already in use');
      }
    }

    // Mã hóa mật khẩu nếu có cập nhật password
    let hashedPassword;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    // Cập nhật thông tin user
    await user.update({
      user_name,
      email,
      role,
      status,
      password: hashedPassword || user.password // Giữ mật khẩu cũ nếu không cập nhật
    });

    return user; // Trả về user đã được cập nhật
  } catch (error) {
    throw new Error(error.message);
  }
};
