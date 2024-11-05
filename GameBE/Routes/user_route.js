// routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser,handleUpdateUserNameOrEmail,getUserInfoById,handleUpdatePassword,handleGetAllUsers,updateUserController} from '../Controller/user_controller.js';
import { getAllGames,getGameById,getGames,getGamesByName,getGamesWithFilters,
    getGameCountByGenres,getGameCountByPlayerNumber,getGameCountByUser,createGame,
    getSimilarGames,getGamesByUserHistory,handleUpdateGame, getGamesByUserId} from '../Controller/game_controller.js';
import { verifyToken,checkUseJWT } from '../Middleware/JWTAction.js';
import upload from '../Middleware/upload.js'
const routers = express.Router();

// Định nghĩa route đăng ký
routers.post('/users/register', registerUser);
// Định nghĩa route đăng nhập
routers.post('/users/login', loginUser);
// Lấy thông tin game theo ID
routers.get('/game/:id', getGameById);
// Lấy tất cả các game
routers.get('/gamesall', getAllGames);
//Lấy số game theo param
routers.get('/games', getGames);
//Lấy số game theo tên
routers.get('/games/search', getGamesByName);
// API tìm game với các điều kiện và phân trang
routers.get('/games/searchs', getGamesWithFilters);
// API đếm số lượng game theo player_number
routers.get('/games/count/player-number', getGameCountByPlayerNumber);
// API đếm số lượng game theo genres
routers.get('/games/count/genres', getGameCountByGenres);
// API đếm số lượng game theo user_name
routers.get('/games/count/users', getGameCountByUser);
// Định nghĩa route cho API tìm game tương tự
routers.get('/games/similar/:id', getSimilarGames);

routers.get('/gamehistory',checkUseJWT, getGamesByUserHistory);
routers.get('/mygame',checkUseJWT, getGamesByUserId);
// Route để lấy thông tin người dùng theo ID
routers.get('/user/get', checkUseJWT, getUserInfoById);
// Route để cập nhật tên hoặc email của người dùng
routers.put('/user/update_profile',checkUseJWT, handleUpdateUserNameOrEmail);
// Route để cập nhập password người dùng
routers.put('/user/change_password',checkUseJWT, handleUpdatePassword);
// Route để cập nhập thông tin game
routers.put('/game/update_info/:id',checkUseJWT,handleUpdateGame)
// Route để lấy tất cả người dùng
routers.get('/users/all', handleGetAllUsers);
// Route để cập nhật thông tin user theo ID
routers.put('/user/update_user/:id', updateUserController);

routers.post('/game/upgame',checkUseJWT, upload.fields([{ name: 'file_path' }, { name: 'image_file_path' }]), createGame);
export default routers;
