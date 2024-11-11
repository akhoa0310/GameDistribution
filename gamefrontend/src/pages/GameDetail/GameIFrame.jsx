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
    fetch(`http://localhost:3000/api/game/${slug}`)
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
    fetch(`http://localhost:3000/api/addhistory/${slug}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ played_time: new Date() }),
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
            src={gameData.file_path}
            title={gameData.game_name}
            style={{
              width: '100%', // Đảm bảo iframe chiếm 100% chiều rộng của Row
              height: '500px',
              border: '2px solid #ccc',
              visibility: isPlaying ? 'visible' : 'hidden', // Ẩn iframe khi chưa chơi game
            }}
          />
          {/* Hình ảnh và nút play được căn lên trên iframe */}
          {!isPlaying && (
            <>
              <Image
                src={gameData.image_file_path}
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
                variant="success"
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
                Play Now
              </Button>
            </>
          )}
        </Col>
      </Row>

      {/* Bảng thông tin chi tiết của game */}
      <Row>
        <Col>
          <GameRating slug={slug} />
          <h3>Game Information</h3>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <th>Game Name:</th>
                <td>{gameData.game_name}</td>
              </tr>
              <tr>
                <th>Description:</th>
                <td>{gameData.game_description}</td>
              </tr>
              <tr>
                <th>Instructions:</th>
                <td>{gameData.instructions}</td>
              </tr>
              <tr>
                <th>Release Date:</th>
                <td>{new Date(gameData.date_release).toDateString()}</td>
              </tr>
              <tr>
                <th>Genres:</th>
                <td>{gameData.genres}</td>
              </tr>
              <tr>
                <th>Player Count:</th>
                <td>{gameData.player_count}</td>
              </tr>
              <tr>
                <th>Player Number:</th>
                <td>{gameData.player_number}</td>
              </tr>
              <tr>
                <th>Player Name:</th>
                <td>{gameData.User.user_name}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <CommentSection slug={slug}/>
    </Container> 
  );
};

export default GameIframe;
