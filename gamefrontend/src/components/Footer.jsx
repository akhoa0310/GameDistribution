import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Logo_XGame from '../assets/Logo_XGame-011.png';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <Container>
        <Row className="justify-content-center align-items-center text-center py-3">
          <Col xs={12} md={3}>
            <img src={Logo_XGame} alt="Game Distribution" style={footerLogoStyle} />
          </Col>
          <Col xs={12} md={3} className="mt-3 mt-md-0">
            <p>
              <i className="fas fa-map-marker-alt"></i> Boeing Avenue 30, 1119 PE Schiphol-Rijk, The Netherlands
            </p>
          </Col>
          <Col xs={12} md={3} className="mt-3 mt-md-0">
            <a href="https://azerion.com/privacy-policy" style={footerLinksStyle}>Privacy policy</a> |{' '}
            <a href="https://azerion.com/platform-privacy-policy" style={footerLinksStyle}>Platform Privacy policy</a> |{' '}
            <a href="https://azerion.com/terms-conditions" style={footerLinksStyle}>Terms & conditions</a>
          </Col>
          <Col xs={12} md={3} className="mt-3 mt-md-0">
            <p>Follow us</p>
            <a href="https://www.linkedin.com/company/azerion" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin" style={footerIconStyle}></i>
            </a>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <p>© Azerion 2024</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#f9f9f9',
  padding: '20px 0',
};

const footerLogoStyle = {
  height: '50px',
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
