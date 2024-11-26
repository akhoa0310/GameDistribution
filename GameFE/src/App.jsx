import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home/Home'; 
import Game from './pages/Games/Game.jsx'; 
import AboutUs from './pages/AboutUs'; 
import Support from './pages/Support'; 
import GameDetail from './pages/GameDetail/Game_Detail.jsx'
import UserInfo from './pages/UserInfo/UserInfo.jsx';
import AdminPage from './pages/Admin/Admin.jsx';
import {AuthProvider } from "./services/AuthContext.js";
import ProtectedRoute from "./services/ProtectRoute.js"
import Footer from './components/Footer.jsx';

const App = () => { 
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/support" element={<Support />} />
          <Route path="/games/:slug" element={<GameDetail />} />
          <Route
            path="/userinfo"
            element={
              <ProtectedRoute allowedRoles={['0', '1', '2']}>  
                <UserInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="pageadmin"
            element={
              <ProtectedRoute allowedRoles={['2']}>  
                <AdminPage />
              </ProtectedRoute>   
            }
          />
          {/* Route chặn cho các route không hợp lệ */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer/>
      </Router>
      </AuthProvider>

  );
};

export default App;
