import React from 'react';
import UserProfile from '../UserInfo/UserProfile';// Import component UserProfile

const Menu = () => {
    return (
        <div>
            <h2>User Profile</h2>
            <UserProfile /> {/* Hiển thị thông tin người dùng từ UserProfile */}
        </div>
    );
};

export default Menu;
