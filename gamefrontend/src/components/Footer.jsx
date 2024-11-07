import React from 'react';
import Logo_XGame from '../assets/Logo_XGame-011.png'

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerContainerStyle}>
        <div>
          <img src={Logo_XGame} alt="Game Distribution" style={footerLogoStyle} />
        </div>
        <div style={footerSectionStyle}>
          <p><i className="fas fa-map-marker-alt"></i> Boeing Avenue 30, 1119 PE Schiphol-Rijk, The Netherlands</p>
        </div>
        <div style={footerSectionStyle}>
          <a href="https://azerion.com/privacy-policy" style={footerLinksStyle}>Privacy policy</a> |
          <a href="https://azerion.com/platform-privacy-policy" style={footerLinksStyle}>Platform Privacy policy</a> |
          <a href="https://azerion.com/terms-conditions" style={footerLinksStyle}>Terms & conditions</a>
        </div>
        <div style={footerSectionStyle}>
          <p>Follow us</p>
          <a href="https://www.linkedin.com/company/azerion" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin" style={footerIconStyle}></i>
          </a>
        </div>
      </div>
      <div>
        <p>© Azerion 2024</p>
      </div>
    </footer>
  )
  ;
}
const footerStyle = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    textAlign: 'center',
  };

  const footerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const footerLogoStyle = {
    height: '50px',
  };

  const footerSectionStyle = {
    margin: '10px',
  };

  const footerLinksStyle = {
    color: '#007bff',
    margin: '0 5px',
    textDecoration: 'none',
  };

  const footerIconStyle = {
    fontSize: '24px',
    color: '#007bff',
  };

export default Footer;
