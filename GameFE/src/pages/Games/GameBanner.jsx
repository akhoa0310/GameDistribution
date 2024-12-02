import React, { useEffect, useState } from 'react';
import { Card, Carousel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const GameBanner = () => {
    const [topPicks, setTopPicks] = useState([]);
    const [christmasGames, setChristmasGames] = useState([]);
    const [bestNewGames, setBestNewGames] = useState([]);
    
    // Separate index states for each carousel
    const [topPicksIndex, setTopPicksIndex] = useState(0);
    const [christmasIndex, setChristmasIndex] = useState(0);
    const [bestNewIndex, setBestNewIndex] = useState(0);

    useEffect(() => {
        // Fetch data for each category
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/top-played`)
            .then((res) => res.json())
            .then((data) => setTopPicks(data.data));

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/genre/Racing`)
            .then((res) => res.json())
            .then((data) => setChristmasGames(data.data));

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/newest`)
            .then((res) => res.json())
            .then((data) => setBestNewGames(data.data));
    }, []);

    // Auto-switch for each carousel every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setTopPicksIndex((prevIndex) => (prevIndex + 1) % 10);
            setChristmasIndex((prevIndex) => (prevIndex + 1) % 10);
            setBestNewIndex((prevIndex) => (prevIndex + 1) % 10);
        }, 15000); // 15 seconds interval

        return () => clearInterval(interval);
    }, []);

    // Render a single game card with link
    const renderGameCard = (game) => (
        <Link to={`/games/${game.slug}`}>
            <Card className="ratio ratio-16x9">
                <Card.Img 
                    src={`${process.env.REACT_APP_BACKEND_URL}/${game.image_file_path || ''}`} 
                    alt={game.game_name} 
                    className="game-image"
                    onError={(e) => {
                        e.target.onerror = null; // Ngăn lặp vô hạn nếu ảnh fallback cũng bị lỗi
                        e.target.src = '/Logo XGame/Logo_XGame-01.png'; // Ảnh mặc định
                    }}
                />
            </Card>
        </Link>
    );

    return (
        <Row>
            <Col>
                <Carousel activeIndex={topPicksIndex} onSelect={(selectedIndex) => setTopPicksIndex(selectedIndex)} controls={true} indicators={false} interval={null}>
                    {topPicks.map((game, i) => (
                        <Carousel.Item key={i}>
                            {renderGameCard(game)}
                        </Carousel.Item>
                    ))}
                </Carousel>
                <h3 className="category-title">Top Picks</h3>
            </Col>
            <Col>
                <Carousel activeIndex={christmasIndex} onSelect={(selectedIndex) => setChristmasIndex(selectedIndex)} controls={true} indicators={false} interval={null}>
                    {christmasGames.map((game, i) => (
                        <Carousel.Item key={i}>
                            {renderGameCard(game)}
                        </Carousel.Item>
                    ))}
                </Carousel>
                <h3 className="category-title">Racing</h3>
            </Col>
            <Col>
                <Carousel activeIndex={bestNewIndex} onSelect={(selectedIndex) => setBestNewIndex(selectedIndex)} controls={true} indicators={false} interval={null}>
                    {bestNewGames.map((game, i) => (
                        <Carousel.Item key={i}>
                            {renderGameCard(game)}
                        </Carousel.Item>
                    ))}
                </Carousel>
                <h3 className="category-title">Best New</h3>
            </Col>
        </Row>
    );
};

export default GameBanner;
