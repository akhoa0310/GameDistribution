import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [error, setError] = useState(null); // State để lưu trữ thông báo lỗi

    // Lấy danh sách người dùng từ API
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/all`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch users'); // Bắt lỗi khi response không thành công
                }
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setError(null); // Xóa thông báo lỗi nếu dữ liệu được lấy thành công
            })
            .catch((error) => {
                setError('Error fetching users'); // Thiết lập thông báo lỗi
                console.error('Error:', error);
            });
    }, []);

    // Cập nhật trường trong danh sách users
    const handleInputChange = (e, userId, field) => {
        const { value } = e.target;
        setUsers(users.map(user => 
            user.user_id === userId ? { ...user, [field]: value } : user
        ));
    };

    // Gửi dữ liệu chỉnh sửa đến server
    const handleSaveChanges = (user) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/update_user/${user.user_id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update user'); // Bắt lỗi khi response không thành công
                }
                return response.json();
            })
            .then((data) => {
                setEditingUser(null);
                setUsers(users.map((u) => (u.user_id === data.user_id ? data : u)));
            })
            .catch((error) => {
                setError('Error updating user'); // Thiết lập thông báo lỗi
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <h2>User Management</h2>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Role (0: user, 1: publisher, 2: admin)</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>
                                <Form.Control
                                    type="text"
                                    value={user.user_name}
                                    onChange={(e) => handleInputChange(e, user.user_id, 'user_name')}
                                    onFocus={() => setEditingUser(user.user_id)}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => handleInputChange(e, user.user_id, 'email')}
                                    onFocus={() => setEditingUser(user.user_id)}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="password"
                                    placeholder="Change password"
                                    onChange={(e) => handleInputChange(e, user.user_id, 'password')}
                                    onFocus={() => setEditingUser(user.user_id)}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="text"
                                    value={user.role}
                                    onChange={(e) => handleInputChange(e, user.user_id, 'role')}
                                    onFocus={() => setEditingUser(user.user_id)}
                                />
                            </td>
                            <td>
                                <Form.Control
                                    type="text"
                                    value={user.status}
                                    onChange={(e) => handleInputChange(e, user.user_id, 'status')}
                                    onFocus={() => setEditingUser(user.user_id)}
                                />
                            </td>
                            <td>
                                <Button
                                    variant="success"
                                    onClick={() => handleSaveChanges(user)}
                                    disabled={editingUser !== user.user_id}
                                >
                                    Save
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserPage;
