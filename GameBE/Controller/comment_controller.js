import { addComment,getCommentsBySlug } from "../DB/Actions/comment_action.js";


export const addCommentController = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy user_id từ hàm checkUseJWT
        const { slug } = req.params; // Lấy game_id từ slug trong param
        const { content } = req.body; // Lấy nội dung comment từ body

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Gọi hàm action để thêm comment vào cơ sở dữ liệu
        const comment = await addComment(userId, slug, content);

        res.status(201).json({
            message: 'Comment added successfully',
            data: {
                cmt_id: comment.cmt_id,
                user_id: comment.user_id,
                user_name: comment.user_name, 
                game_id: comment.game_id,
                time: comment.time,
                content: comment.content,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

export const getCommentsBySlugController = async (req, res) => {
    const { slug } = req.params;

    try {
        const comments = await getCommentsBySlug(slug);

        if (comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this game' });
        }

        res.status(200).json({
            message: 'Comments retrieved successfully',
            data: comments,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};
