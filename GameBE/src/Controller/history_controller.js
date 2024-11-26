import { findGamesByUserHistory,addGameHistory } from "../DB/Actions/history_action.js";


export const addGameHistoryController = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy user_id từ hàm checkUseJWT
        const { slug } = req.params; // Lấy game_id từ slug trong param

        // Gọi hàm action để thêm hoặc cập nhật lịch sử vào cơ sở dữ liệu
        const result = await addGameHistory(userId, slug);

        res.status(201).json({
            message: result.createdAt ? 'Game history added successfully' : 'Game history updated successfully',
            data: {
                history_id: result.history_id,
                user_id: result.user_id,
                game_id: result.game_id,
                played_time: result.played_time,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};


export const getGamesByUserHistory = async (req, res) => {
    try {
        const user_id = req.user.id;
        const limit = parseInt(req.query.limit) || 4; // Số lượng game mỗi trang, mặc định 10
        const page = parseInt(req.query.page) || 1;    // Trang hiện tại, mặc định là 1

        // Tính offset
        const offset = (page - 1) * limit ; // offset dựa vào chunk 4 trang

        // Gọi hàm tìm game với user_id, limit và offset
        const { gameHistory, totalGames } = await findGamesByUserHistory(user_id, limit, offset);

        // Tính tổng số trang dựa vào chunk 4 trang mỗi lần
        const totalPages = Math.ceil(totalGames / limit);

        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalGames:totalGames,
            games: gameHistory,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};