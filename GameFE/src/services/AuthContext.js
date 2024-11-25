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
    const token = Cookies.get('jwt');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp > currentTime) {
          setAuthState({
            isAuthenticated: true,
            user_name: decoded.user_name,
            role: decoded.role,
            loading: false, // Xác thực hoàn tất
          });
        } else {
          Cookies.remove('jwt');
          setAuthState({ isAuthenticated: false, user_name: null, role: null, loading: false });
        }
      } catch (error) {
        console.error('Token không hợp lệ:', error);
        Cookies.remove('jwt');
        setAuthState({ isAuthenticated: false, user_name: null, role: null, loading: false });
      }
    } else {
      setAuthState({ isAuthenticated: false, user_name: null, role: null, loading: false });
    }
  }, []);

  const logout = () => {
    Cookies.remove('jwt');
    setAuthState({ isAuthenticated: false, user_name: null, role: null, loading: false });
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ ...authState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
