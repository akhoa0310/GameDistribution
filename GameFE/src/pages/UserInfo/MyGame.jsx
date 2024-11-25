import React, { useEffect, useState } from 'react';
import GameBox from '../../components/GameBox'; // Import component GameBox
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap'; // Import thêm Alert và Spinner

const MyGame = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // State để kiểm tra trạng thái loading
  const [error, setError] = useState(null); // State để kiểm tra lỗi
  const gamesPerPage = 3; // Số lượng game mỗi trang

  useEffect(() => {
    const fetchGames = async (page) => {
      setLoading(true); // Khi bắt đầu fetch, set loading là true
      setError(null); // Reset lỗi khi bắt đầu gọi API
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mygame?limit=${gamesPerPage}&page=${page}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch games'); // Nếu API trả về lỗi
        }

        const data = await response.json();
        setGames(data.games); // Giả sử API trả về mảng game trong 'games'
        setTotalPages(data.totalPages); // Tổng số trang
        setLoading(false); // Khi dữ liệu đã được tải xong
      } catch (error) {
        setLoading(false); // Đảm bảo trạng thái loading tắt khi có lỗi
        setError(error.message); // Lưu lỗi vào state
        console.error('Error fetching games:', error);
      }
    };

    fetchGames(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <Container className="py-4">
        <h2 className="text-primary mb-4">My Game History</h2>
        {/* Hiển thị Spinner khi đang tải */}
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Đang tải...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <h2 className="text-primary mb-4">My Game History</h2>
        {/* Hiển thị thông báo lỗi */}
        <Alert variant="danger">
          Có lỗi xảy ra: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">

      <Row className="gy-3">
        {games.map((game) => (
          <Col key={game.game_id} xs={12} md={4}>
            <GameBox
              played_time={game.played_time}
              title={game.game_name}
              developer={game.User.user_name}
              imageUrl={`${process.env.REACT_APP_BACKEND_URL}/public${game.image_file_path}`}
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
