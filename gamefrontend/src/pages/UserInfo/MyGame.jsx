import React, { useEffect, useState } from 'react';
import GameBox from '../../components/GameBox';// Import component GameBox

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const GameHistory = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gamesPerPage = 3; // Số lượng game mỗi trang

  useEffect(() => {
    const fetchGames = async (page) => {
      try {
        const response = await fetch(`http://localhost:3000/api/mygame?limit=${gamesPerPage}&page=${page}`, {
            method: 'GET',
            credentials: 'include'
          });
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
    <div style={styles.container}>

      <div style={styles.gameList}>
        {games.map((game) => (
          <GameBox
            key={game.game_id}
            played_time={game.played_time}
            title={game.game_name}
            developer={game.User.user_name}
            imageUrl={
              game.image_file_path
                ? `${backendUrl}/public${game.image_file_path}`
                : 'public/Logo XGame/Logo_XGame-01.png'
            }
            gameUrl={`${window.location.origin}/games/${game.slug}`}
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
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#4a00e0',
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

export default GameHistory;
