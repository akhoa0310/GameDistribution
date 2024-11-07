import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar'; // Import SearchBar component
import GameBox from '../../components/GameBox'; // Import GameBox component

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SearchGameList = () => {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState(''); // State quản lý giá trị query
  const [genres, setGenres] = useState([]); // State cho thể loại game
  const [developers, setDevelopers] = useState([]); // State cho nhà phát triển
  const [playerNumber, setPlayerNumber] = useState(''); // State cho số người chơi
  const [genreOptions, setGenreOptions] = useState([]); // Danh sách thể loại từ API
  const [developerOptions, setDeveloperOptions] = useState([]); // Danh sách nhà phát triển từ API
  const [playerNumberOptions, setPlayerNumberOptions] = useState([]); // Danh sách số lượng người chơi từ API
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gamesPerPage = 12; // Số lượng game mỗi trang

  // Lấy dữ liệu cho bộ lọc từ BE
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Gọi API để lấy genres, developers và player numbers
        const genreRes = await fetch('http://localhost:3000/api/games/count/genres');
        const developerRes = await fetch('http://localhost:3000/api/games/count/users');
        const playerNumberRes = await fetch('http://localhost:3000/api/games/count/player-number');

        const genresData = await genreRes.json();
        const developersData = await developerRes.json();
        const playerNumbersData = await playerNumberRes.json();
        

        // Chuyển đổi genresData
        const genresArray = Object.entries(genresData).map(([name, count]) => ({
          name,
          count,
        }));

        // Chuyển đổi developersData
        const developersArray = developersData.map((dev) => ({
          id: dev.user_id,
          name: dev.user_name.trim(), // Bỏ khoảng trắng thừa
          count: dev.count,
        }));
        

        const playerNumbersArray = Object.entries(playerNumbersData).map(([label, count]) => ({
          value: label.split(' ')[0], // Giả sử lấy số người chơi từ label
          label: label, // Dùng label gốc để hiển thị
          count // Có thể dùng count nếu cần
        }));

        // Gán dữ liệu vào state
        setGenreOptions(genresArray); // Mảng các thể loại
        setDeveloperOptions(developersArray); // Mảng các nhà phát triển
        setPlayerNumberOptions(playerNumbersArray); // Mảng số lượng người chơi (VD: "1 người", "2 người", "coop")
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData(); // Gọi hàm lấy dữ liệu bộ lọc từ BE
  }, []);

  // Lấy danh sách game dựa trên các bộ lọc
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/games/searchs?query=${query}&genres=${genres}&user_id=${developers}&player_number=${playerNumber}&limit=${gamesPerPage}&page=${currentPage}`
        );
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          return;
        }
        const data = await response.json();

        // Gán dữ liệu lấy từ API
        setGames(data.games); // Giả sử API trả về mảng game trong 'games'
        setTotalPages(data.totalPages); // Tổng số trang
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, [currentPage, query, genres, developers, playerNumber]); // Mỗi khi query, genres, developers, playerNumber, hoặc currentPage thay đổi sẽ gọi API

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div style={styles.container}>
      
      {/* Sidebar lọc */}
      <div style={styles.content}>
        <div style={styles.sidebar}>
          <h3>Lọc theo</h3>

          {/* Lọc theo thể loại */}
          <div style={styles.filterSection}>
            <h4>Thể loại</h4>
            <select value={genres} onChange={(e) => setGenres(e.target.value)} style={styles.filterSelect}>
              <option value="">Tất cả</option>
              {genreOptions.map((genre) => (
                <option key={genre.name} value={genre.name}>
                  {genre.name} ({genre.count} game{genre.count > 1 ? 's' : ''})
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo nhà phát triển */}
          <div style={styles.filterSection}>
            <h4>Nhà phát triển</h4>
            <select value={developers} onChange={(e) => setDevelopers(e.target.value)} style={styles.filterSelect}>
              <option value="">Tất cả</option>
              {developerOptions.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name} ({dev.count} game{dev.count > 1 ? 's' : ''})
                </option>
              ))}
            </select>
          </div>

          {/* Lọc theo số lượng người chơi */}
          <div style={styles.filterSection}>
            <h4>Số người chơi</h4>
            <select value={playerNumber} onChange={(e) => setPlayerNumber(e.target.value)} style={styles.filterSelect}>
              <option value="">Tất cả</option>
              {playerNumberOptions.map((option, index) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
              ))}
            </select>
          </div>
        </div>


        {/* Danh sách game */}
        <div style={styles.mainContent}>
          {/* Thanh tìm kiếm */}
          <SearchBar query={query} setQuery={setQuery} />

          <div style={styles.gameList}>
            {games.map((game) => (
              <GameBox
                key={game.game_id}
                title={game.game_name}
                developer={game.User.user_name}
                imageUrl={
                  game.image_file_path
                    ? `${backendUrl}/public${game.image_file_path}`
                    : 'public/Logo XGame/Logo_XGame-01.png'
                }
                gameUrl={`${window.location.origin}/games/${game.game_id}`}
              />
            ))}
          </div>

          {/* Thanh điều hướng trang */}
          <div style={styles.pagination}>
            <button
              style={styles.pageButton}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                style={currentPage === index + 1 ? styles.activePageButton : styles.pageButton}
              >
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </button>
            ))}
            <button
              style={styles.pageButton}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  content: {
    display: 'flex',
  },
  sidebar: {
    width: '20%',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
  },
  filterSection: {
    marginBottom: '20px',
  },
  filterSelect: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #e0e0e0',
  },
  mainContent: {
    width: '75%', // Đảm bảo chiều rộng đủ để không bị tràn
    marginLeft: '5%',
    overflow: 'hidden',
  },
  gameList: {
    display: 'flex',
    flexWrap: 'wrap', // Cho phép các game xuống dòng nếu không đủ chỗ
    justifyContent: 'flex-start',
    gap: '20px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  pageButton: {
    padding: '10px',
    margin: '0 5px',
    borderRadius: '50%',
    backgroundColor: '#6200ea',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    fontSize: '16px',
  },
  activePageButton: {
    padding: '10px',
    margin: '0 5px',
    borderRadius: '50%',
    backgroundColor: '#3700b3',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    fontSize: '16px',
  },
};

export default SearchGameList;
