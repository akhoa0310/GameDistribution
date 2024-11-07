import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Form, Button } from 'react-bootstrap';

function UserProfile() {
    const [userInfo, setUserInfo] = useState({ user_name: '', email: '' });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Lấy thông tin người dùng từ JWT (giả sử có API /api/users/profile)
        fetch('http://localhost:3000/api/user/get', {
            method: 'GET',
            credentials: 'include'
          })
        .then(response => response.json())
        .then(data => {
            setUserInfo({ user_name: data.user_name, email: data.email });
        });
    }, []);

    const handleInfoChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const saveUserInfo = () => {
        fetch('http://localhost:3000/api/user/update_profile', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo)
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            if (status === 200) {
                alert(body.message); // Hiển thị thông báo thành công
            } else {
                alert(body.error || 'Có lỗi xảy ra'); // Hiển thị thông báo lỗi nếu có lỗi
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi kết nối đến server');
        });
    };

    const updatePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Mật khẩu mới không khớp');
            return;
        }
        
        fetch('http://localhost:3000/api/user/change_password', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passwordData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Mật khẩu đã được cập nhật');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        });
    };  

    return (
        <div className="container mt-4">
            <Tabs defaultActiveKey="info" id="user-profile-tabs" className="mb-3">
                <Tab eventKey="info" title="Thông tin">
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="user_name"
                                value={userInfo.user_name}
                                onChange={handleInfoChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleInfoChange}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={saveUserInfo}>Lưu thông tin</Button>
                    </Form>
                </Tab>

                <Tab eventKey="password" title="Mật khẩu">
                    <Form>
                        <Form.Group controlId="formOldPassword">
                            <Form.Label>Mật khẩu cũ</Form.Label>
                            <Form.Control
                                type="password"
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNewPassword">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formConfirmPassword">
                            <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={updatePassword}>Lưu mật khẩu</Button>
                    </Form>
                </Tab>
            </Tabs>
        </div>
    );
}

export default UserProfile;
