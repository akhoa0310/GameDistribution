import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GameIframe = () => {
  const {slug} = useParams(); // Lấy id từ URL
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API sử dụng fetch với id từ params
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
  }, [slug]); // Chỉ chạy lại khi id thay đổi

  if (error) return <div>Error: {error}</div>;
  if (!gameData) return <div>Loading...</div>;

  // Style object
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    gamePlay: {
      marginBottom: '20px'
    },
    iframe: {
      width: '100%',
      height: '500px',
      border: 'none'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    th: {
      textAlign: 'left',
      padding: '10px',
      backgroundColor: '#f2f2f2',
      border: '1px solid #ccc'
    },
    td: {
      padding: '10px',
      border: '1px solid #ccc'
    },
    img: {
      width: '150px',
      marginBottom: '10px'
    },
    heading: {
      color: '#333',
      fontSize: '24px',
      marginBottom: '15px'
    },
    subHeading: {
      fontSize: '20px',
      marginBottom: '10px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Iframe hiển thị trò chơi */}
      <div style={styles.gamePlay}>
        <h3 style={styles.subHeading}>Play Game</h3>
        <iframe 
          src={gameData.file_path} 
          title={gameData.game_name} 
          style={styles.iframe}
        />
      </div>

      {/* Bảng thông tin chi tiết của game */}
      <div className="game-info">
        <h3 style={styles.heading}>Game Information</h3>
        <table style={styles.table}>
          <tbody>
            <tr>
              <th style={styles.th}>Game Name:</th>
              <td style={styles.td}>{gameData.game_name}</td>
            </tr>
            <tr>
              <th style={styles.th}>Description:</th>
              <td style={styles.td}>{gameData.game_description}</td>
            </tr>
            <tr>
              <th style={styles.th}>Instructions:</th>
              <td style={styles.td}>{gameData.instructions}</td>
            </tr>
            <tr>
              <th style={styles.th}>Release Date:</th>
              <td style={styles.td}>{new Date(gameData.date_release).toDateString()}</td>
            </tr>
            <tr>
              <th style={styles.th}>Genres:</th>
              <td style={styles.td}>{gameData.genres}</td>
            </tr>
            <tr>
              <th style={styles.th}>Player Count:</th>
              <td style={styles.td}>{gameData.player_count}</td>
            </tr>
            <tr>
              <th style={styles.th}>Player Number:</th>
              <td style={styles.td}>{gameData.player_number}</td>
            </tr>
            <tr>
              <th style={styles.th}>Player Name:</th>
              <td style={styles.td}>{gameData.User.user_name}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameIframe;
