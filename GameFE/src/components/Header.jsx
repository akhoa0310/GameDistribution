import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from '../services/AuthContext.js';
import Logo_XGame from '../assets/Logo_XGame-011.png';
import LoginRegisterModal from './LoginModal';
import GameSearch from './SearchGame.jsx';

const Header = () => {
  const { isAuthenticated,user_name, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header>
      <Navbar bg="light" expand="md" className="py-3">
        <Container fluid className="ms-md-3 ms-sm-1">
          <Navbar.Brand as={Link} to="/" className="ms-md-3 ms-sm-1">
            <img
              src={Logo_XGame}
              alt="Logo"
              style={{ width: '115px', height: 'auto' }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" className="justify-content-end">
            <Nav className="ms-auto">
              <Nav.Item>
                <Nav.Link as={Link} to="/game">Game</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="https://xgamestudio.com/">Về chúng tôi</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/business">Kinh doanh</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/supporto">Hỗ trợ</Nav.Link>
              </Nav.Item>
              <Nav.Item style={searchStyle}>
                <GameSearch/>
              </Nav.Item>
              <Nav.Item>
                {isAuthenticated ? (
                  <NavDropdown
                    title={`Hi, ${user_name}`}
                    id="user-dropdown"
                    align="end"
                    show={showDropdown}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <NavDropdown.Item as={Link} to="/userinfo">Hồ sơ</NavDropdown.Item>
                    <NavDropdown.Item as="button" onClick={logout}>
                      Đăng xuất
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LoginRegisterModal />
                )}
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

const searchStyle = {
  marginRight: '1rem', // Tạo khoảng cách giữa các mục Nav
};