import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Cài đặt thư viện này nếu chưa có: npm install jwt-decode



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = Cookies.get('jwt');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Kiểm tra token có hết hạn không
        if (decodedToken.exp * 1000 > Date.now()) {
          setUserInfo({
            id: decodedToken.id,
            user_name: decodedToken.user_name,
            email: decodedToken.email,
            role: decodedToken.role
          });

          setIsLoggedIn(true);
        } else {
          // Token hết hạn, xoá cookie
          Cookies.remove('jwt');

        }
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        Cookies.remove('jwt');
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setUserInfo({
        id: decodedToken.id,
        user_name: decodedToken.user_name,
        email: decodedToken.email,
        role: decodedToken.role
      });
      setIsLoggedIn(true);
      Cookies.set('jwt', token);
    } catch (error) {
      console.error("Token không hợp lệ:", error);
    }
  };

  const logout = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
    Cookies.remove('jwt');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
