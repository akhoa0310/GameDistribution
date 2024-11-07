import React from 'react';

const SearchBar = ({ query, setQuery }) => {
  return (
    <div style={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search Games"
        value={query} // Hiển thị giá trị query hiện tại
        onChange={(e) => setQuery(e.target.value)} // Cập nhật giá trị query khi người dùng gõ
        style={styles.searchInput}
      />
      <select style={styles.sortSelect}>
        <option value="popular">Popular</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
};


const styles = {
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    width: '70%',
    borderRadius: '5px',
    border: '1px solid #e0e0e0',
  },
  sortSelect: {
    padding: '10px',
    width: '25%',
    borderRadius: '5px',
    border: '1px solid #e0e0e0',
  },
};

export default SearchBar;
