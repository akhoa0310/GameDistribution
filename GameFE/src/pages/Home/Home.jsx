import React from 'react';
import Banner from './Banner';
import GameList from '../../components/GameList';


function Home() {
  return (
    <div>
      <Banner/>
      {/* Hiển thị danh sách game dưới đây */}
      <GameList/>

    </div>
  );
}

export default Home;
