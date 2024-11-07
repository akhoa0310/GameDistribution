import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameBox = ({ title, developer, imageUrl, gameUrl, played_time }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Điều hướng tới URL của game
    window.location.href = gameUrl; 
  };

  return (
    <div onClick={handleClick} style={styles.gameCard}>
      <img src={imageUrl} style={styles.gameImage} />
      <h3 style={styles.gameTitle}>{title}</h3>
      <p style={styles.gameDeveloper}>{developer}</p>
      {played_time && <p style={styles.playedTime}>Played on:{played_time}</p>}
    </div>
  );
};

const styles = {
  gameCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '12px', // Làm tròn các góc
    padding: '15px',
    cursor: 'pointer',
    textAlign: 'left', // Canh trái
    width: '250px', // Chiều rộng tăng lên cho giống hình
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow nhẹ hơn
    backgroundColor: '#fff',
    margin: '10px', // Khoảng cách giữa các thẻ
  },
  gameCardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  gameImage: {
    width: '100%', // Đảm bảo ảnh chiếm toàn bộ chiều rộng của thẻ
    height: '150px', // Chiều cao cố định
    objectFit: 'cover', // Cắt ảnh nếu vượt quá
    borderRadius: '8px', // Làm tròn góc ảnh
  },
  gameTitle: {
    fontSize: '18px', // Kích thước chữ lớn hơn
    margin: '10px 0 5px 0',
    fontWeight: 'bold',
    color: '#333',
    whiteSpace: 'nowrap', // Giới hạn chữ trong một dòng
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Thêm dấu "..." nếu chữ quá dài
  },
  gameDeveloper: {
    fontSize: '14px',
    color: '#888',
    margin:'0',
  },
  playedTime: {
    fontSize: '14px',
    color: '#555',
    margin: '0', // Loại bỏ khoảng trống bên dưới
    paddingBottom: '5px', // Thêm khoảng trống nhỏ dưới thẻ playedTime
  },
};

export default GameBox;
