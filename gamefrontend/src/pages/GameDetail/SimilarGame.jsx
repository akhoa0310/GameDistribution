import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameBox from '../../components/GameBox'; // Đảm bảo rằng bạn đã import GameBox

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SimilarGames = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [similarGames, setSimilarGames] = useState([]); // Tạo state lưu game tương tự
  const [loading, setLoading] = useState(true); // State để hiển thị loading

  useEffect(() => {
    const fetchSimilarGames = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/games/similar/${id}`); // Gọi API với id
        const data = await response.json();
        setSimilarGames(data.games.slice(0, 4)); // Giới hạn chỉ lấy 4 game từ dữ liệu trả về
        setLoading(false); // Tắt loading
      } catch (error) {
        console.error('Error fetching similar games:', error);
        setLoading(false); // Tắt loading trong trường hợp lỗi
      }
    };

    fetchSimilarGames();
  }, [id]); // Gọi lại khi id thay đổi

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi đang tải
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Similar Games</h2>
      <div style={styles.gameList}>
        {similarGames.map((game) => (
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
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#4a00e0',
  },
  gameList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: '20px', // Khoảng cách giữa các thẻ
  },
};

export default SimilarGames;
