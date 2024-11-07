import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { useAuth } from '../services/AuthContext.js';
import Logo_XGame from '../assets/Logo_XGame-011.png';
import LoginRegisterModal from './LoginModal';

Modal.setAppElement('#root');

const Header = () => {
  const { isLoggedIn, userInfo, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <ul style={styles.ul}>
          <li style={styles.li}>
            <Link to="/">
              <img src={Logo_XGame} alt="Logo" style={styles.icon} />
            </Link>
          </li>
          <li style={styles.li}><Link to="/game">Game</Link></li>
          <li style={styles.li}><Link to="/aboutus">About Us</Link></li>
          <li style={styles.li}><Link to="/business">Business</Link></li>
          <li style={styles.li}><Link to="/support">Support</Link></li>
          <li style={styles.li}>
            {isLoggedIn ? (
              <div 
                style={styles.dropdown}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button style={styles.dropdownButton}>{"Hi, " + userInfo.user_name}</button>
                <div style={{
                  ...styles.dropdownContent, 
                  display: showDropdown ? 'block' : 'none'
                }}>
                  <Link to="/userinfo">Profile</Link>
                  <button onClick={logout} style={styles.logoutButton}>Logout</button>
                </div>
              </div>
            ) : (
              <LoginRegisterModal />
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

// Style cho component
const styles = {
  header: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  ul: {
    listStyleType: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
    paddingLeft: 0,
    margin: 0,
  },
  li: {
    margin: '0 20px',
    fontWeight: 'bold',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
  },
  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownButton: {
    backgroundColor: '#00BFFF',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  dropdownContent: {
    display: 'none',
    position: 'absolute',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    padding: '10px',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column', // Xếp theo chiều dọc
    gap: '10px', // Khoảng cách giữa các phần tử
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#333',
    cursor: 'pointer',
    padding: '10px 0',
  },
  icon: {
    width: '115px',
    height: 'auto',
  }
};