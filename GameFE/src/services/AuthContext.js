import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Không cần dấu ngoặc nhọn
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user_name: null,
    role: null,
    loading: true, // Thêm trạng thái loading
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/check-login`, {
          method: 'GET',
          credentials: 'include', // Gửi cookies trong request
        });
  
        const data = await response.json();
  
        if (data.isAuthenticated) {
          setAuthState({
            isAuthenticated: true,
            user_name: data.user_name,
            role: data.role,
            loading: false, // Xác thực hoàn tất
          });
        } else {
          setAuthState({ isAuthenticated: false, user_name: null, role: null, loading: false });
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
        setAuthState({ isAuthenticated: false, user_name: null, role: null, loading: false });
      }
    };
  
    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      // Gửi yêu cầu POST đến backend để đăng xuất
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Đảm bảo gửi cookies trong request
      });
  
      const data = await response.json();
      if (data.message === 'Logout successful') {
        // Cập nhật trạng thái auth trong frontend sau khi đăng xuất
        setAuthState({ isAuthenticated: false, user_name: null, role: null, loading: false });
        
        // Dẫn người dùng quay lại trang chủ hoặc trang login
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Lỗi khi logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
