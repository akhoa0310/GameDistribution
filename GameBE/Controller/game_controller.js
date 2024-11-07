// controllers/gameController.js
import {findGameBySlug,findAllGames,findGames,countTotalGames,findGamesbyName,countTotalGamesByName,
    countGamesByGenre, countGamesByPlayerNumber,updateGame,countGamesByUser,searchGamesWithFilters,
    findSimilarGame,findGamesByUserId,addGame,createGameZipFile, 
    } from "../DB/Actions/game_action.js";

// Hàm lấy thông tin game theo ID
export const getGameBySlug = async (req, res) => {
    try {
        const {slug} = req.params;
        const game = await findGameBySlug(slug);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json(game);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Hàm lấy tất cả các game
export const getAllGames = async (req, res) => {
    try {
        const games = await findAllGames();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Hàm API lấy danh sách game với phân trang
export const getGames = async (req, res) => {
    try {
        // Lấy limit và page từ query params, mặc định nếu không có là limit=10 và page=1
        const limit = parseInt(req.query.limit) || 8;
        const page = parseInt(req.query.page) || 1;

        // Tính toán offset để bỏ qua các game trước đó (trong các trang trước)
        const offset = (page - 1) * limit;

        // Gọi hàm findGames để lấy danh sách game tương ứng với limit và offset
        const games = await findGames(limit, offset);

        // Gọi hàm countTotalGames để lấy tổng số game
        const totalGames = await countTotalGames();
        const totalPages = Math.ceil(totalGames / limit);

        // Trả về dữ liệu game và thông tin phân trang
        res.json({
            currentPage: page,
            totalPages: totalPages,
            totalGames: totalGames,
            itemsPerPage: limit,
            games: games
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getGamesByName = async (req, res) => {
    try {
        const query = req.query.query;
  
      // Gọi hàm findGameByName để lấy danh sách game tương ứng với limit và offset
      const games = await findGamesbyName(query);
  
      // Gọi hàm countTotalGamesByName để lấy tổng số game khớp với từ khóa
      const totalGames = await countTotalGamesByName(query);

      // Trả về dữ liệu game và thông tin phân trang
      res.json({
        totalGames: totalGames,
        games: games,
      });
      
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


// API tìm game với các điều kiện và phân trang
export const getGamesWithFilters = async (req, res) => {
    try {
      const query = req.query.query || ''; // Chuỗi tìm kiếm, mặc định là chuỗi rỗng nếu không có
      const genres = req.query.genres;
      const user_id = req.query.user_id;
      const player_number = req.query.player_number;
  
      // Lấy limit và page từ query params, mặc định nếu không có là limit=10 và page=1
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
  
      // Tính toán offset để bỏ qua các game trước đó (trong các trang trước)
      const offset = (page - 1) * limit;
  
      // Tạo object filters từ các query params
      const filters = { genres, user_id, player_number };
  
      // Gọi hàm searchGamesWithFilters để lấy danh sách game tương ứng với limit, offset, và các bộ lọc
      const { games, totalCount } = await searchGamesWithFilters(query, filters, limit, offset);
      
      const totalPages = Math.ceil(totalCount / limit);
  
      // Trả về dữ liệu game và thông tin phân trang
      res.json({
        currentPage: page,
        totalPages: totalPages,
        totalGames: totalCount,
        itemsPerPage: limit,
        games: games,
      });
      
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

export const getGameCountByPlayerNumber = async (req, res) => {
    try {
        const countData = await countGamesByPlayerNumber();
        res.json(countData);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// API lấy số lượng game theo genres
export const getGameCountByGenres = async (req, res) => {
    try {
        const countData = await countGamesByGenre();
        res.json(countData);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// API lấy số lượng game theo user_id và trả về user_name
export const getGameCountByUser = async (req, res) => {
    try {
        const countData = await countGamesByUser();
        res.json(countData);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getSimilarGames = async (req, res) => {
    try {
        const {slug} = req.params; // Lấy slug từ URL parameter
        const similarGames = await findSimilarGame(slug); // Gọi hàm tìm game tương tự


        res.status(200).json({
            message: 'Similar games found',
            games: similarGames,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getGamesByUserId = async (req, res) => {
    try {
        const user_id = req.user.id;
        const limit = parseInt(req.query.limit) || 4; // Số lượng game mỗi trang, mặc định 10
        const page = parseInt(req.query.page) || 1;    // Trang hiện tại, mặc định là 1

        // Tính offset
        const offset = (page - 1) * limit ; // offset dựa vào chunk 4 trang

        // Gọi hàm tìm game với user_id, limit và offset
        const { myGame, totalGames } = await findGamesByUserId(user_id, limit, offset);

        // Tính tổng số trang dựa vào chunk 4 trang mỗi lần
        const totalPages = Math.ceil(totalGames / limit);

        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalGames:totalGames,
            games: myGame,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



// Hàm cập nhật thông tin game theo ID
export const handleUpdateGame = async (req, res) => {
    const { id } = req.params; // Lấy ID từ URL
    const {
        user_id,
        game_name,
        game_description,
        instructions,
        date_release,
        player_count,
        player_number,
        genres,
        file_path,
        image_file_path,
        status,
    } = req.body; // Lấy dữ liệu từ request body

    try {
        // Tạo object gameData từ request body
        const gameData = {
            user_id,
            game_name,
            game_description,
            instructions,
            date_release,
            player_count,
            player_number,
            genres,
            file_path,
            image_file_path,
            status,
        };

        // Gọi hàm updateGame từ action
        const updatedGame = await updateGame(id, gameData);

        return res.status(200).json({ message: 'Game updated successfully', game: updatedGame });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const createGame = async (req, res) => {
    try {
        const gameData = req.body;
        gameData.user_id = req.user.id;
        console.log(gameData);
        // Kiểm tra file zip và file hình ảnh
        const zipFilePath = req.files['file_path'][0].path; // Đường dẫn file zip tải lên
        const imageFilePath = req.files['image_file_path'][0].path; // Đường dẫn file hình ảnh tải lên

        // Tạo game
        const newGame = await addGame(gameData, zipFilePath, imageFilePath);

        res.status(201).json({ message: 'Game created successfully', game: newGame });
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ message: 'Failed to create game', error });
    }
};

export const downloadGameFolder = async (req, res) => {
    const { game_id } = req.params;

    try {
        // Gọi hàm action để thực hiện logic và gửi về response
        await createGameZipFile(game_id, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
