import {GameHistory} from "../Models/game_history_model.js"
import { Game } from "../Models/game_model.js";
import { User } from "../Models/user_model.js";
// Action thêm lịch sử chơi game
export const addGameHistory = async (userId, slug) => {
    try {
        // Tìm game dựa trên slug
        const game = await Game.findOne({ where: { slug } });

        if (!game) {
            throw new Error('Game not found');
        }

        // Kiểm tra nếu đã có lịch sử chơi của user với game này
        const existingHistory = await GameHistory.findOne({
            where: {
                user_id: userId,
                game_id: game.game_id,
            },
        });

        if (existingHistory) {
            // Cập nhật thời gian chơi nếu lịch sử đã tồn tại
            existingHistory.played_time = new Date(); // Cập nhật thời gian hiện tại
            await existingHistory.save();
            return existingHistory;
        } else {
            // Tạo mới lịch sử chơi nếu chưa tồn tại
            const newHistory = await GameHistory.create({
                user_id: userId,
                game_id: game.game_id,
                played_time: new Date(),
            });
            return newHistory;
        }
    } catch (error) {
        throw new Error(error.message);
    }
};


export const findGamesByUserHistory = async (user_id, limit, offset) => {
    try {   
        const gameHistory = await GameHistory.findAll({
            where: { user_id },
            limit:limit,
            offset:offset,
            include: [
                {
                    model: Game,
                    attributes: ['game_id', 'game_name', 'game_description', 'date_release', 'genres','image_file_path'],
                    include:[
                        {
                        model: User, // Tham chiếu tới model User
                        attributes: ['user_name'] // Chỉ lấy trường user_name
                        },
                    ],
                },
                
            ],
        });

        // Đếm tổng số game dựa trên lịch sử của user để tính tổng số trang
        const totalGames = await GameHistory.count({ where: { user_id } });
        return { gameHistory, totalGames };
    } catch (error) {
        throw new Error(error.message);
    }
};
