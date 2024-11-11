import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GameBox = ({ title, developer, imageUrl, gameUrl, played_time }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Điều hướng tới URL của game
    window.location.href = gameUrl;
  };

  return (
    <Card 
      className="game-card" 
      style={styles.gameCard}
      onClick={handleClick}
    >
      <Card.Img variant="top" src={imageUrl} style={styles.gameImage} />
      <Card.Body>
        <Card.Title style={styles.gameTitle}>{title}</Card.Title>
        <Card.Text style={styles.gameDeveloper}>{developer}</Card.Text>
        {played_time && <Card.Text style={styles.playedTime}>Played on: {played_time}</Card.Text>}
      </Card.Body>
    </Card>
  );
};

const styles = {
  gameCard: {
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow nhẹ hơn
    backgroundColor: '#fff',
    margin: '10px', // Khoảng cách giữa các thẻ
    borderRadius: '12px',
  },
  gameImage: {
    height: '150px', // Chiều cao cố định
    objectFit: 'cover', // Cắt ảnh nếu vượt quá
    borderTopLeftRadius: '12px', // Làm tròn góc trên bên trái
    borderTopRightRadius: '12px', // Làm tròn góc trên bên phải
  },
  gameTitle: {
    fontSize: '18px', // Kích thước chữ lớn hơn
    fontWeight: 'bold',
    color: '#333',
    whiteSpace: 'nowrap', // Giới hạn chữ trong một dòng
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Thêm dấu "..." nếu chữ quá dài
  },
  gameDeveloper: {
    fontSize: '14px',
    color: '#888',
    margin: '0',
  },
  playedTime: {
    fontSize: '14px',
    color: '#555',
    margin: '0',
    paddingBottom: '5px', // Thêm khoảng trống nhỏ dưới thẻ playedTime
  },
};

export default GameBox;
