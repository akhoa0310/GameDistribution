import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Table, Image, Alert } from 'react-bootstrap';
import { GameRating } from './GameRating';
import CommentSection from './GameComment';
const GameIframe = () => {
  const { slug } = useParams(); // Lấy slug từ URL
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Kiểm tra trạng thái chơi

  useEffect(() => {
    // Gọi API lấy thông tin game bằng slug
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/${slug}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGameData(data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [slug]);

  const handlePlayNow = () => {
    // Gọi API thêm lịch sử chơi game
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/addhistory/${slug}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ played_time: new Date() }),
    })
      .then(() => {
        // Gọi API đếm số lượng chơi
        return fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/increment/${slug}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
      })
      .then(() => {
        setIsPlaying(true); // Chuyển sang trạng thái đang chơi
      })
      .catch(error => {
        setError(error.message);
      });
  };

  if (error) return <Alert variant="danger">Error: {error}</Alert>;
  if (!gameData) return <Alert variant="info">Loading...</Alert>;

  return (
    <Container style={{ paddingTop: '20px' }}>
      <Row className="mb-4 justify-content-center">
        <Col className="text-center" style={{ position: 'relative' }}>
          {/* Hiển thị iframe trước */}
          <iframe
            src={`${process.env.REACT_APP_BACKEND_URL}${gameData.file_path}`}
            title={gameData.game_name}
            style={{
              width: '100%', // Đảm bảo iframe chiếm 100% chiều rộng của Row
              height: '500px',
              border: '2px solid #ccc',
              visibility: isPlaying ? 'visible' : 'hidden', // Ẩn iframe khi chưa chơi game
            }}
          />
          
                {!isPlaying && (
                <>
                  <Image
                  src={`${process.env.REACT_APP_BACKEND_URL}${gameData.image_file_path}`}
                  alt={gameData.game_name}
                  fluid
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    width: '200px',
                    marginBottom: '20px',
                  }}
                  />
                  <Button
                  variant="primary" // Đổi màu nút thành xanh dương
                  size="lg"
                  onClick={handlePlayNow}
                  style={{
                    position: 'absolute',
                    top: '70%', // Dịch xuống một chút so với vị trí gốc
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                  }}
                  >
                  Chơi ngay
                  </Button>
                </>
                )}
              </Col>
              </Row>
              <GameRating slug={slug} />
              {/* Bảng thông tin chi tiết của game */}
      <Row>
        <Col>
            {/* Game Title */}
          <div style={{ marginBottom: '20px' }}>
            <h2>
              Tên trò chơi: <strong>{gameData.game_name}</strong>
            </h2>
          </div>
              {/* Publisher */}
          <div style={{ marginBottom: '20px' }}>
            <span>Phát hành bởi: </span>
            <strong>{gameData.User.user_name}</strong>
          </div>

          {/* Genres */}
          <div style={{ marginBottom: '20px' }}>
            <span>Thể loại: </span>
            <strong>{gameData.genres}</strong>
          </div>

          {/* Release Date */}
          <div style={{ marginBottom: '20px' }}>
            <span>Ngày phát hành: </span>
            <strong>{new Date(gameData.date_release).toLocaleDateString()}</strong>
          </div>

          {/* Player Information */}
          <div style={{ marginBottom: '20px' }}>
            <span>Số lượt chơi: </span>
            <strong>{gameData.player_count}</strong>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <span>Số người chơi: </span>
            <strong>{gameData.player_number}</strong> players
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Mô tả</h3>
            <p>{gameData.game_description}</p>
          </div>

          {/* Instructions */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Hướng dẫn</h3>
            <p>{gameData.instructions}</p>
          </div>
        </Col>
      </Row>
      <CommentSection slug={slug}/>
    </Container> 
  );
};

export default GameIframe;
