// routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser,checkLoginStatus,logoutUserController,handleUpdateUserNameOrEmail,getUserInfoById,handleUpdatePassword,handleGetAllUsers,updateUserController} from '../Controller/user_controller.js';
import { getAllGames,getGameBySlug,getGames,getGamesByName,getGamesWithFilters,getGameCountByGenres,
    getGameCountByPlayerNumber,getGameCountByUser,createGame,getSimilarGames,handleUpdateGame,
    getGamesByUserId,downloadGameFolder,incrementGamePlayerCountController,getTopPlayedGamesController,
    getNewestGamesController,getGamesByGenreController} from '../Controller/game_controller.js';
import { getGamesByUserHistory, addGameHistoryController} from '../Controller/history_controller.js';
import { addCommentController,getCommentsBySlugController } from '../Controller/comment_controller.js';
import { addVoteController,getAverageRatingController,getUserRatingController } from '../Controller/vote_controller.js';
import { handleCreateRequest,handleAcceptRequest,handleRejectRequest,handleGetRequestsWithUserNames} from '../Controller/request_controller.js';
import { verifyToken,checkUseJWT } from '../Middleware/JWTAction.js';
import upload from '../Middleware/upload.js'

const routers = express.Router();

routers.post('/users/register', registerUser);  // Đăng ký
routers.post('/users/login', loginUser);        // Đăng nhập
routers.get('/auth/check-login', checkLoginStatus);
routers.post('/auth/logout', logoutUserController);
// Các route user yêu cầu check JWT
routers.get('/user/get', checkUseJWT(), getUserInfoById);  // Lấy thông tin user theo ID
routers.put('/user/update_profile', checkUseJWT(), handleUpdateUserNameOrEmail); // Cập nhật tên/email
routers.put('/user/change_password', checkUseJWT(), handleUpdatePassword);       // Cập nhật password
routers.put('/user/update_user/:id', checkUseJWT([2]), updateUserController); // Cập nhật user theo ID (admin)
routers.get('/users/all',checkUseJWT([2]), handleGetAllUsers);   // Lấy tất cả người dùng (admin)

// Game routes
routers.get('/game/:slug', getGameBySlug);          // Lấy thông tin game theo slug
routers.get('/gamesall', getAllGames);              // Lấy tất cả game
routers.get('/games', getGames);                    // Lấy game theo param
routers.get('/games/search', getGamesByName);       // Lấy game theo tên
routers.get('/games/searchs', getGamesWithFilters); // Tìm game với các điều kiện
routers.get('/games/count/player-number', getGameCountByPlayerNumber);  // Đếm game theo player_number
routers.get('/games/count/genres', getGameCountByGenres);               // Đếm game theo genres
routers.get('/games/count/users', getGameCountByUser);                  // Đếm game theo user_name
routers.get('/games/similar/:slug', getSimilarGames);                   // Tìm game tương tự
routers.get('/games/top-played', getTopPlayedGamesController);
routers.get('/games/newest', getNewestGamesController);
routers.get('/games/genre/:genre', getGamesByGenreController);
routers.post('/game/increment/:slug', incrementGamePlayerCountController);


// Các route game yêu cầu check JWT
routers.get('/mygame', checkUseJWT(), getGamesByUserId);                  // Lấy game của user
routers.put('/game/update_info/:id', checkUseJWT([2]), handleUpdateGame);    // Cập nhật thông tin game
routers.get('/game/sendgame/:slug', downloadGameFolder);             // Tải xuống folder game (không cần JWT)
routers.post('/game/upgame', checkUseJWT([1,2]), upload.fields([{ name: 'file_path' }, { name: 'image_file_path' }]), createGame); // Upload game

// History routes yêu cầu check JWT
routers.post('/addhistory/:slug', checkUseJWT(), addGameHistoryController);  // Thêm lịch sử game
routers.get('/gamehistory', checkUseJWT(), getGamesByUserHistory);           // Lấy lịch sử game của user

// Comment routes
routers.get('/games/:slug/comments', getCommentsBySlugController);         // Lấy comment theo slug (không cần JWT)

// Comment routes yêu cầu check JWT
routers.post('/games/:slug/comments', checkUseJWT(), addCommentController);  // Thêm comment

// Vote routes
routers.get('/games/:slug/vote', getAverageRatingController);              // Lấy rating trung bình (không cần JWT)

// Vote routes yêu cầu check JWT
routers.post('/games/:slug/vote', checkUseJWT(), addVoteController);         // Thêm vote
routers.get('/games/:slug/user-rating', checkUseJWT(), getUserRatingController); // Lấy rating của user


routers.get('/request/get',checkUseJWT([2]), handleGetRequestsWithUserNames);// Route lấy danh sách requests với thông tin user

routers.post('/request/publisher',checkUseJWT([0]), handleCreateRequest) // Route tao request
routers.put('/request/accept/:requestId',checkUseJWT([2]), handleAcceptRequest);  // Route chấp nhận request
routers.put('/request/reject/:requestId',checkUseJWT([2]), handleRejectRequest);  // Route từ chối request

//Role( 0:user, 1:publisher, 2:admin) 
export default routers;
