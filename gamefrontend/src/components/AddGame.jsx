import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddGameButton = ({ refreshGames }) => {
  const [showModal, setShowModal] = useState(false);
  const [gameName, setGameName] = useState('');
  const [genre, setGenre] = useState('');
  const [filePath, setFilePath] = useState(null);
  const [imageFilePath, setImageFilePath] = useState(null);
  const [gameDescription, setGameDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [error, setError] = useState(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setGameName('');
    setGenre('');
    setFilePath(null);
    setImageFilePath(null);
    setGameDescription('');
    setInstructions('');
    setPlayerNumber('');
    setError(null);
  };

  const handleFileChange = (event) => {
    setFilePath(event.target.files[0]);
  };

  const handleImageFileChange = (event) => {
    setImageFilePath(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('game_name', gameName);
    formData.append('genres', genre);
    formData.append('file_path', filePath);
    formData.append('image_file_path', imageFilePath);
    formData.append('game_description', gameDescription);
    formData.append('instructions', instructions);
    formData.append('player_number', playerNumber);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/game/upgame`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        alert('Game added successfully!');
        refreshGames();
        handleClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add game');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error adding game');
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Game
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="gameName">
              <Form.Label>Game Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter game name"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="genre">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="filePath">
              <Form.Label>File Path</Form.Label>
              <Form.Control
                type="file"
                accept=".html,.zip,.rar"
                onChange={(e) => setFilePath(e.target.files[0])}
                required
              />
            </Form.Group>

            <Form.Group controlId="imageFilePath">
              <Form.Label>Image File Path</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFilePath(e.target.files[0])}
                required
              />
            </Form.Group>

            <Form.Group controlId="gameDescription">
              <Form.Label>Game Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter game description"
                value={gameDescription}
                onChange={(e) => setGameDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="instructions">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="playerNumber">
              <Form.Label>Player Number</Form.Label>
              <Form.Control
                type="textarea"
                placeholder="Enter number of players"
                value={playerNumber}
                onChange={(e) => setPlayerNumber(e.target.value)}
                required
              />
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <Button variant="primary" type="submit">
              Add Game
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddGameButton;
