import React from 'react';
import { Tab,Tabs } from 'react-bootstrap';
import UserProfile from './UserProfile';
import GameHistory from './GameHistory';
import MyGame from './MyGame';
import AddGame from '../../components/AddGame';


function UserInfo() {
  return (
    <div>
      <UserProfile/>
      
      <div className="container mt-4">
            <Tabs defaultActiveKey="myGame" id="game-tabs" className="mb-3">
                <Tab eventKey="myGame" title="My Game">
                    <MyGame />
                </Tab>
                <Tab eventKey="gameHistory" title="Game History">
                    <GameHistory />
                </Tab>
                <Tab eventKey="addGame" title="AddGame">
                    <AddGame/>
                </Tab>
            </Tabs>
        </div>
    </div>
  );
}

export default UserInfo;
