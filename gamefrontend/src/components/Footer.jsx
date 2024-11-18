import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Logo_XGame from '../assets/Logo_XGame-02.png';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#f58023', color: '#fff', padding: '10px 0' }}> {/* Giảm padding từ 20px xuống 10px */}
      <Container>
        <Row>
          <Col md={4} className="text-center mb-2"> {/* Giảm margin bottom */}
            <img src={Logo_XGame} alt="XGame Studio" style={{ width: '125px' }} /> {/* Giảm kích thước logo */}
            <div className="d-flex justify-content-center mt-2">
              <a href="#" className="text-white mx-1" style={{ fontSize: '14px' }}> {/* Giảm kích thước icon */}
                <FaFacebookF />
              </a>
              <a href="#" className="text-white mx-1" style={{ fontSize: '14px' }}>
                <FaInstagram />
              </a>
              <a href="#" className="text-white mx-1" style={{ fontSize: '14px' }}>
                <FaTwitter />
              </a>
              <a href="#" className="text-white mx-1" style={{ fontSize: '14px' }}>
                <FaLinkedinIn />
              </a>
            </div>
          </Col>
          <Col md={4} className="text-center mb-2">
            <h6>Contact</h6> {/* Giảm kích thước chữ tiêu đề */}
            <p style={{ fontSize: '14px', margin: '5px 0' }}> {/* Giảm kích thước chữ và margin */}
              📍 <a href="https://maps.app.goo.gl/Bnhbzbm3LyYJkSXX7" target="_blank" rel="noopener noreferrer" className="text-white">
                The Nine, No. 9 Pham Van Dong, Mai Dich, Cau Giay, Hanoi
              </a>
            </p>
            <p style={{ fontSize: '14px', margin: '5px 0' }}>
              📞 <a href="tel:+84948814919" className="text-white">094 881 4919</a>
            </p>
            <p style={{ fontSize: '14px', margin: '5px 0' }}>
              📧 <a href="mailto:tuyendung@xgamevn.com" className="text-white">tuyendung@xgamevn.com</a>
            </p>
            <p style={{ fontSize: '14px', margin: '5px 0' }}>
              🌐 <a href="http://www.xgamestudio.com" target="_blank" rel="noopener noreferrer" className="text-white">www.xgamestudio.com</a>
            </p>
          </Col>
          <Col md={4} className="text-center mb-2">
            <h6>XGame Studio</h6> {/* Giảm kích thước chữ tiêu đề */}
            <p style={{ fontSize: '14px', margin: '5px 0' }}><a href="#" className="text-white">About Us</a></p>
            <p style={{ fontSize: '14px', margin: '5px 0' }}><a href="#" className="text-white">Careers</a></p>
            <p style={{ fontSize: '14px', margin: '5px 0' }}><a href="#" className="text-white">News</a></p>
            <p style={{ fontSize: '14px', margin: '5px 0' }}><a href="#" className="text-white">Values</a></p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
