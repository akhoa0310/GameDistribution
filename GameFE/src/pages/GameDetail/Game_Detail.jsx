import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GameIframe from './GameIFrame';
import SimilarGames from './SimilarGame';

function GameDetail() {
  return (
    <Container style={{ padding: '20px' }}>
      <Row className="g-4">
        <Col md={8} style={{ padding: '10px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
          <GameIframe />
        </Col>
        <Col md={4} style={{ padding: '10px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
          <SimilarGames />
        </Col>
      </Row>
    </Container>
  );
}

export default GameDetail;
