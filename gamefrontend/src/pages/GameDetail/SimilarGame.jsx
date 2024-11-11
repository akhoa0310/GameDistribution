import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameBox from '../../components/GameBox';
import { Container, Row, Spinner } from 'react-bootstrap';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SimilarGames = () => {
  const { slug } = useParams();
  const [similarGames, setSimilarGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarGames = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/games/similar/${slug}`);
        const data = await response.json();
        setSimilarGames(data.games.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching similar games:', error);
        setLoading(false);
      }
    };

    fetchSimilarGames();
  }, [slug]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="p-4 bg-light rounded">
      <h2 className="text-center mb-4 text-primary">Similar Games</h2>
      <Row className="gy-4 flex-column">
        {similarGames.map((game) => (
          <div key={game.game_id} className="mb-3">
            <GameBox
              title={game.game_name}
              developer={game.User.user_name}
              imageUrl={
                game.image_file_path
                  ? `${backendUrl}/public${game.image_file_path}`
                  : 'public/Logo XGame/Logo_XGame-01.png'
              }
              gameUrl={`${window.location.origin}/games/${game.slug}`}
            />
          </div>
        ))}
      </Row>
    </Container>
  );
};

export default SimilarGames;
