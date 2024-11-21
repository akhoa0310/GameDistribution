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
      <Card.Img
        variant="top"
        src={imageUrl || '/Logo XGame/x1.png'} // Nếu imageUrl trống, sử dụng ảnh mặc định
        style={styles.gameImage}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/Logo XGame/x1.png'; // Ảnh mặc định khi lỗi
        }}
      />
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
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    backgroundColor: '#fff',
    margin: '10px',
    borderRadius: '12px',
  },
  gameImage: {
    height: '150px',
    objectFit: 'cover',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  },
  gameTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
    paddingBottom: '5px',
  },
};

export default GameBox;
