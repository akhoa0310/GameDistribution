// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles, redirectPath = '/' }) => {
  const { isAuthenticated, role, loading } = useAuth();

  // Hiển thị giao diện chờ nếu đang kiểm tra xác thực
  if (loading) {
    return <div className="loading">Đang kiểm tra quyền truy cập...</div>;
  }

  // Điều hướng nếu chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  // Điều hướng nếu không có quyền truy cập
  if (!allowedRoles.includes(String(role))) {
    return <Navigate to="/403" />;
  }

  // Hiển thị nội dung nếu hợp lệ
  return children;
};

export default ProtectedRoute;
