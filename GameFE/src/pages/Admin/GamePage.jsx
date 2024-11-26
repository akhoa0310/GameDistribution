import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Form } from 'react-bootstrap';
import AddGame from '../../components/AddGame';

const GamePage = () => {
    const [games, setGames] = useState([]);
    const [totalGames, setTotalGames] = useState(0); // State để lưu tổng số game tìm thấy
    const [show, setShow] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [developerOptions, setDeveloperOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = (game) => {
        setSelectedGame(game);
        setShow(true);
    };

    // Fetch games dựa trên searchQuery
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/search?query=${searchQuery}`)
            .then((res) => res.json())
            .then((data) => {
                setGames(data.games);
                setTotalGames(data.totalGames); // Cập nhật tổng số game
            })
            .catch((error) => console.error('Error:', error));
    }, [searchQuery]);

    // Fetch developer options
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/count/users`)
            .then((res) => res.json())
            .then((data) => setDeveloperOptions(data))
            .catch((error) => console.error('Error:', error));
    }, []);

    // Gửi dữ liệu chỉnh sửa đến server
    const handleSaveChanges = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/update_info/${selectedGame.game_id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedGame),
        })
            .then((response) => response.json())
            .then(() => {
                handleClose();
                setGames(games.map(game => game.game_id === selectedGame.game_id ? selectedGame : game));
            })
            .catch((error) => console.error('Error:', error));
    };

    return (
        <div>
            {/* Header với thanh tìm kiếm */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Game Management</h2>
                <AddGame/>
                <h4>Total Games Found: {totalGames}</h4>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    {/* <Button variant="primary" onClick={() => setSearchQuery(searchQuery)}>
                        Search
                    </Button> */}
                </div>
            </div>




            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Game Name</th>
                        <th>Genre</th>
                        <th>Description</th>
                        <th>Developer</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.game_id}>
                            <td>{game.game_id}</td>
                            <td>{game.game_name}</td>
                            <td>{game.genres}</td>
                            <td>{game.game_description}</td>
                            <td>{game.User?.user_name || 'Unknown'}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShow(game)}>
                                    Edit Game
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal form */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedGame && (
                        <Form>
                            <Form.Group controlId="gameName">
                                <Form.Label>Game Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedGame.game_name}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, game_name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="developer">
                                <Form.Label>Developer</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedGame.user_id}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, user_id: e.target.value })}
                                >
                                    <option value="">Select Developer</option>
                                    {developerOptions.map((dev) => (
                                        <option key={dev.user_id} value={dev.user_id}>
                                            {dev.user_name} ({dev.count} game{dev.count > 1 ? 's' : ''})
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            {/* Các trường khác */}
                            <Form.Group controlId="gameDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={selectedGame.game_description}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, game_description: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="instructions">
                                <Form.Label>Instructions</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={selectedGame.instructions}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, instructions: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="dateRelease">
                                <Form.Label>Release Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={selectedGame.date_release}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, date_release: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="playerCount">
                                <Form.Label>Player Count</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedGame.player_count}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, player_count: e.target.value })}
                                />
                            </Form.Group>
                            
                            <Form.Group controlId="playerNumber">
                                <Form.Label>Player Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedGame.player_number}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, player_number: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="genres">
                                <Form.Label>Genre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedGame.genres}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, genres: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="filePath">
                                <Form.Label>Game File Path</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedGame.file_path}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, file_path: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="imageFilePath">
                                <Form.Label>Image File Path</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedGame.image_file_path}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, image_file_path: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="status">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedGame.status}
                                    onChange={(e) => setSelectedGame({ ...selectedGame, status: e.target.value })}
                                />
                            </Form.Group>

                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default GamePage;
