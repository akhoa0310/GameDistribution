import React, { useEffect, useState } from 'react';
import GameBox from '../../components/GameBox'; // Import component GameBox
import { Container, Row, Col, Button } from 'react-bootstrap';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const MyGame = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gamesPerPage = 3; // Số lượng game mỗi trang

  useEffect(() => {
    const fetchGames = async (page) => {
      try {
        const response = await fetch(`http://localhost:3000/api/mygame?limit=${gamesPerPage}&page=${page}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        setGames(data.games); // Giả sử API trả về mảng game trong 'games'
        setTotalPages(data.totalPages); // Tổng số trang
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container className="py-4">
      <h2 className="text-primary mb-4">My Game History</h2>

      <Row className="gy-3">
        {games.map((game) => (
          <Col key={game.game_id} xs={12} md={4}>
            <GameBox
              played_time={game.played_time}
              title={game.game_name}
              developer={game.User.user_name}
              imageUrl={
                game.image_file_path
                  ? `${backendUrl}/public${game.image_file_path}`
                  : `${backendUrl}/public/Logo XGame/Logo_XGame-01.png`
              }
              gameUrl={`${window.location.origin}/games/${game.slug}`}
            />
          </Col>
        ))}
      </Row>

      {/* Thanh điều hướng trang */}
      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="me-2"
        >
          &lt;
        </Button>

        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            variant={currentPage === index + 1 ? 'primary' : 'outline-primary'}
            className="me-2"
          >
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </Button>
        ))}

        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </Button>
      </div>
    </Container>
  );
};

export default MyGame;
