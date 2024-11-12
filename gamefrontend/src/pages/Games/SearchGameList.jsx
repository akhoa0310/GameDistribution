import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar'; // Import SearchBar component
import GameBox from '../../components/GameBox'; // Import GameBox component
import { Container, Row, Col, Form, Button } from 'react-bootstrap';


const SearchGameList = () => {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(''); // State dùng debounce
  const [genres, setGenres] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [playerNumber, setPlayerNumber] = useState('');
  const [genreOptions, setGenreOptions] = useState([]);
  const [developerOptions, setDeveloperOptions] = useState([]);
  const [playerNumberOptions, setPlayerNumberOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gamesPerPage = 12; // Số lượng game mỗi trang

  // Sử dụng debounce cho thanh tìm kiếm
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timerId);
  }, [query]);

  // Lấy dữ liệu cho các bộ lọc từ backend
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const genreRes = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/games/count/genres');
        const developerRes = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/games/count/users');
        const playerNumberRes = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/games/count/player-number');

        const genresData = await genreRes.json();
        const developersData = await developerRes.json();
        const playerNumbersData = await playerNumberRes.json();

        setGenreOptions(Object.entries(genresData).map(([name, count]) => ({ name, count })));
        setDeveloperOptions(developersData.map(dev => ({
          id: dev.user_id,
          name: dev.user_name.trim(),
          count: dev.count,
        })));
        setPlayerNumberOptions(Object.entries(playerNumbersData).map(([label, count]) => ({
          value: label.split(' ')[0],
          label,
          count,
        })));
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);

  // Lấy danh sách game dựa trên các bộ lọc
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/games/searchs?query=${debouncedQuery}&genres=${genres}&user_id=${developers}&player_number=${playerNumber}&limit=${gamesPerPage}&page=${currentPage}`
        );
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          return;
        }
        const data = await response.json();
        setGames(data.games);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, [debouncedQuery, currentPage, genres, developers, playerNumber]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container>
      {/* Sidebar và phần lọc */}
      <Row>
        <Col md={3}>
          <h3>Lọc theo</h3>

          {/* Lọc theo thể loại */}
          <Form.Group controlId="genreFilter">
            <Form.Label>Thể loại</Form.Label>
            <Form.Control as="select" value={genres} onChange={(e) => setGenres(e.target.value)}>
              <option value="">Tất cả</option>
              {genreOptions.map((genre) => (
                <option key={genre.name} value={genre.name}>
                  {genre.name} ({genre.count} games)
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Lọc theo nhà phát triển */}
          <Form.Group controlId="developerFilter">
            <Form.Label>Nhà phát triển</Form.Label>
            <Form.Control as="select" value={developers} onChange={(e) => setDevelopers(e.target.value)}>
              <option value="">Tất cả</option>
              {developerOptions.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name} ({dev.count} games)
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Lọc theo số lượng người chơi */}
          <Form.Group controlId="playerNumberFilter">
            <Form.Label>Số người chơi</Form.Label>
            <Form.Control as="select" value={playerNumber} onChange={(e) => setPlayerNumber(e.target.value)}>
              <option value="">Tất cả</option>
              {playerNumberOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Danh sách game và thanh tìm kiếm */}
        <Col md={9}>
          <SearchBar query={query} setQuery={setQuery} />

          <Row>
            {games.map((game) => (
              <Col key={game.game_id} xs={12} md={4}>
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

          {/* Thanh phân trang */}
          <div className="d-flex justify-content-center my-3">
            <Button
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &lt;
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? "primary" : "light"}
                onClick={() => handlePageChange(index + 1)}
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
        </Col>
      </Row>
    </Container>
  );
};

export default SearchGameList;
