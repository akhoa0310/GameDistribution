import React from 'react';
import GameIframe from './GameIFrame';
import SimilarGames from './SimilarGame';

function GameDetail() {
  return (
    <div>
    <div style={styles.container}>
      <div style={styles.gameIframeColumn}>
        <GameIframe />
      </div>
      <div style={styles.similarGamesColumn}>
        <SimilarGames />
      </div>
    </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    padding: '20px',
  },
  gameIframeColumn: {
    flex: 7, // Chiếm 70% chiều rộng
    padding: '10px',
    border: '1px solid #ddd',
  },
  similarGamesColumn: {
    flex: 3, // Chiếm 30% chiều rộng
    padding: '10px',
    border: '1px solid #ddd',
  },
};

export default GameDetail;
