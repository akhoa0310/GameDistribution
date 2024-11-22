import React from 'react';
import { Tab, Tabs, Card, Container } from 'react-bootstrap';
import UserProfile from './UserProfile';
import GameHistory from './GameHistory';
import MyGame from './MyGame';
import AddGame from '../../components/AddGame';
import PublisherRequest from './PublisherRequest';
import { useAuth } from '../../services/AuthContext';

function UserInfo() {
  const { role } = useAuth();

  return (
    <Container className="mt-4">
      {/* Hồ sơ người dùng */}
      <Card className="mb-4">

          <UserProfile />

      </Card>

      {/* Tabs điều hướng */}
      <Tabs defaultActiveKey="myGame" id="game-tabs" className="mb-3">
        {/* Tab: My Game */}
        <Tab eventKey="myGame" title="My Game">
          <Card className="mt-3">
            <Card.Body>
              <MyGame />
            </Card.Body>
          </Card>
        </Tab>

        {/* Tab: Game History */}
        <Tab eventKey="gameHistory" title="Game History">
          <Card className="mt-3">
          <Card.Body>
              {role === 1 || role === 2 ? (
                <GameHistory />
              ) : (
                <div>
                  <p>You are a user. Request to become a publisher:</p>
                  <PublisherRequest />
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Tab: Add Game */}
        <Tab eventKey="addGame" title="Add Game">
          <Card className="mt-3">
            <Card.Body>
              {role === 1 || role === 2 ? (
                <AddGame />
              ) : (
                <div>
                  <p>You are a user. Request to become a publisher:</p>
                  <PublisherRequest />
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default UserInfo;
