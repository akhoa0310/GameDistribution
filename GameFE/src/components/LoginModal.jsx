import React, { useState } from 'react';
import { Modal, Button, Form, Tab, Nav } from 'react-bootstrap';

const LoginRegisterModal = () => {
  const [show, setShow] = useState(false);
  const [key, setKey] = useState('login');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        alert('Login successful');
        handleClose();
        window.location.reload();
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_name: formData.fullName,
            email: formData.email,
            password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful');
        handleClose();
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Login/Register
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          {/* <Modal.Title>{key === 'login' ? 'Login' : 'Register'}</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
            <Nav variant="tabs" className="d-flex flex-row justify-content-center mb-2">
              <Nav.Item>
                <Nav.Link eventKey="login">Đăng nhập</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="register">Đăng ký</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3" controlId="formLoginEmail">
                    <Form.Label>Email </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formLoginPassword">
                    <Form.Label>Mật khẩu </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Login
                  </Button>
                </Form>
              </Tab.Pane>
              <Tab.Pane eventKey="register">
                <Form onSubmit={handleRegister}>
                  <Form.Group className="mb-3" controlId="formRegisterFullName">
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter full name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formRegisterEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formRegisterPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formRegisterConfirmPassword">
                    <Form.Label>Nhập lại mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Đăng ký
                  </Button>
                </Form>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginRegisterModal;
