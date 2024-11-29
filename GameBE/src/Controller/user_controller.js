// controllers/authController.js
import {register,login,verifyToken,updateUserNameOrEmail,updateUser,updatePassword,findUserInfoById,getAllUsers } from '../DB/Actions/user_action.js';
import cookieParser from 'cookie-parser';
// Controller đăng ký người dùng
export const registerUser = async (req, res) => {
  const { user_name, email, password } = req.body;
  try {
    const newUser = await register(user_name, email, password);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller đăng nhập người dùng
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await login(email, password);
    res.cookie('jwt',token,{ maxAge: 60 * 60 * 1000, })
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const checkLoginStatus = (req, res) => {
  try {
    const token = req.cookies.jwt; // Lấy token từ cookies
    const user = verifyToken(token); // Gọi action để xác thực token

    res.status(200).json({ 
      isAuthenticated: true, 
      user_name: user.user_name, 
      role: user.role 
    });
  } catch (error) {
    res.status(200).json({ 
      isAuthenticated: false, 
      user_name: null, 
      role: null 
    });
  }
};

export const logoutUserController = (req, res) => {
  try {
    // Xóa cookie JWT từ phía server
    res.clearCookie('jwt', { sameSite: 'None', secure: true });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller xử lý cập nhật tên hoặc email
export const handleUpdateUserNameOrEmail = async (req, res) => {
  const { user_name, email } = req.body;
  const userId = req.user.id; // Lấy ID người dùng từ token đã xác minh

  if (!user_name && !email) {
    return res.status(400).json({ error: 'Vui lòng cung cấp tên hoặc email mới' });
  }

  const result = await updateUserNameOrEmail(userId, user_name, email);

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(400).json({ error: result.message });
  }
};

export const handleUpdatePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id; // Lấy ID người dùng từ JWT đã xác minh

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Mật khẩu mới và xác nhận mật khẩu không khớp' });
  }

  // Gọi action để xử lý thay đổi mật khẩu
  const result = await updatePassword(userId, oldPassword, newPassword);

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(400).json({ error: result.message });
  }
};


export const getUserInfoById = async (req, res) => {
  //const userId = req.params.id; // Lấy ID từ tham số route
  const requesterId = req.user.id; // ID của người dùng đang đăng nhập từ token

  // Kiểm tra quyền truy cập
  // if (userId !== requesterId.toString()) {
  //   return res.status(403).json({ message: 'Access denied. You can only view your own information.' });
  // }

  const result = await findUserInfoById(requesterId);

  if (result.success) {
    res.status(200).json(result.data);
  } else {
    if (result.message === 'User not found') {
      res.status(404).json({ message: result.message });
    } else {
      res.status(500).json({ message: result.message });
    }
  }
};

// Controller xử lý yêu cầu lấy tất cả người dùng
export const handleGetAllUsers = async (req, res) => {
  const result = await getAllUsers();

  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ message: result.message });
  }
};

// Hàm cập nhật thông tin user theo ID
export const updateUserController = async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL
  const { user_name, email, role, status, password } = req.body; // Lấy dữ liệu từ request body

  try {
      // Tạo object userData từ request body
      const userData = { user_name, email, role, status, password };

      // Gọi hàm updateUser từ action
      const updatedUser = await updateUser(id, userData);

      return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
