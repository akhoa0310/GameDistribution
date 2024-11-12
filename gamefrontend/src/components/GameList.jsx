import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import GameBox from './GameBox'; // Import component GameBox


const GameList = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gamesPerPage = 12; // Số lượng game mỗi trang

  useEffect(() => {
    const fetchGames = async (page) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games?limit=${gamesPerPage}&page=${page}`);
        const data = await response.json();

        // Gán dữ liệu lấy từ API
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
      <h2 className="text-primary mb-4 text-center">Exclusive Games</h2>
      
      <Row className="gy-4">
        {games.map((game) => (
          <Col key={game.game_id} xs={12} sm={6} md={4} lg={3}>
            <GameBox
              title={game.game_name}
              developer={game.User.user_name}
              imageUrl={
                game.image_file_path
                  ? `${process.env.REACT_APP_BACKEND_URL}/public${game.image_file_path}`
                  : 'public/Logo XGame/Logo_XGame-01.png'
              }
              gameUrl={`${window.location.origin}/games/${game.slug}`}
            />
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </Container>
  );
};

export default GameList;
