import axios from 'axios';

const BASE_URL = 'https://api.example.com'; // URL của API mà bạn sẽ gọi tới

const gameService = {
  // Lấy danh sách game
  getGames: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/games`);
      return response.data; // Trả về dữ liệu game từ API
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error; // Ném lỗi để xử lý ở component
    }
  },

  // Lấy chi tiết game (nếu cần thêm tính năng này)
  getGameById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/games/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game by ID:', error);
      throw error;
    }
  }
};

export default gameService;
