import React from 'react';
import SearchGameList from './SearchGameList';
import GameBanner from './GameBanner';


function Game() {
  return (
    <div>
      <div className="container mt-4">
        <GameBanner/>
      </div>
      <SearchGameList/>

    </div>
  );
}

export default Game;
