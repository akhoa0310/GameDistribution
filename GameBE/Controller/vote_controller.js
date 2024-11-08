import { addVote,getAverageRating,getUserRating} from "../DB/Actions/vote_action.js";

export const addVoteController = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy user_id từ JWT
        const { slug } = req.params; // Lấy game_id từ slug trong param
        const { rating } = req.body; // Lấy rating từ body

        if (!rating) {
            return res.status(400).json({ message: 'Rating is required' });
        }

        // Gọi hàm action để thêm hoặc cập nhật vote vào cơ sở dữ liệu
        const vote = await addVote(userId, slug, rating);

        res.status(201).json({
            message: 'Vote added successfully',
            data: {
                vote_id: vote.vote_id,
                user_id: vote.user_id,
                game_id: vote.game_id,
                rating: vote.rating,
                time: vote.time,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export const getAverageRatingController = async (req, res) => {
    try {
        const { slug } = req.params; // Lấy game_id từ slug trong param

        // Gọi hàm action để lấy giá trị trung bình và tổng số rating
        const ratingData = await getAverageRating(slug);

        res.status(200).json({
            message: 'Rating data retrieved successfully',
            data: {
                averageRating: parseFloat(ratingData.averageRating).toFixed(1), // Chuyển đổi thành số thực, làm tròn 2 chữ số thập phân
                totalRatings: parseInt(ratingData.totalRatings, 10) // Chuyển đổi thành số nguyên
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export const getUserRatingController = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy user_id từ hàm checkUseJWT
        const { slug } = req.params; // Lấy game_id từ slug trong param

        // Gọi hàm action để lấy rating của người dùng
        const rating = await getUserRating(userId, slug);

        res.status(200).json({
            message: rating !== null ? 'User rating retrieved successfully' : 'No rating found for this user',
            data: {
                rating,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};