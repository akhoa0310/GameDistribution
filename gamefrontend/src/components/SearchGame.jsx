import React, { useState, useRef, useEffect } from 'react';
import { InputGroup, FormControl, Dropdown, Image, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

function GameSearch() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const debounceTimeout = useRef(null);

  // Xử lý tìm kiếm với debounce
  const handleSearch = (e) => {
    const searchText = e.target.value;
    setQuery(searchText);

    // Xóa timeout trước đó
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Đặt timeout mới với độ trễ 500ms
    debounceTimeout.current = setTimeout(async () => {
      if (searchText.length > 0) {
        try {
          const response = await fetch(`http://localhost:3000/api/games/search?query=${searchText}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setGames(data.games);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error fetching games:', error);
        }
      } else {
        setGames([]);
        setShowDropdown(false);
      }
    }, 500); // Độ trễ 500ms
  };

  // Xử lý nhấp ra ngoài để ẩn thanh tìm kiếm và danh sách game
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Chuyển đến trang game riêng khi nhấp vào game
  const handleGameClick = (slug) => {
    const gameUrl = `${window.location.origin}/games/${slug}`;
    window.location.href = gameUrl;
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={searchRef}>
      <InputGroup style={{ width: showSearch ? '300px' : '40px', transition: 'width 0.3s' }}>
        {showSearch && (
          <FormControl
            type="text"
            placeholder="Tìm kiếm game..."
            value={query}
            onChange={handleSearch}
            style={{ borderRadius: '20px 0 0 20px' }}
          />
        )}
        <Button variant="light" onClick={() => setShowSearch(!showSearch)}>
          <FaSearch />
        </Button>
      </InputGroup>

      {showSearch && showDropdown && games.length > 0 && (
        <Dropdown.Menu show style={{ position: 'absolute', top: '100%', left: 0, width: '100%', maxHeight: '200px', overflowY: 'auto', zIndex: 1 }}>
          {games.map((game) => (
            <Dropdown.Item
              key={game.game_id}
              onClick={() => handleGameClick(game.slug)} // Chuyển hướng khi nhấp vào game
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <Image src={game.image_file_path} rounded style={{ width: '40px', height: '40px', marginRight: '10px' }} />
              <div>
                <strong>{game.User.user_name}</strong>
                <div>{game.game_name}</div>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </div>
  );
}

export default GameSearch;
