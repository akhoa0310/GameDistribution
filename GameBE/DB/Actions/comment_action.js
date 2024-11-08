// actions/commentAction.js
import { Comment} from '../Models/comment_model.js';
import {Game} from "../Models/game_model.js";
import { User } from '../Models/user_model.js';
export const addComment = async (userId, slug, content) => {
    try {
        // Tìm game dựa trên slug
        const game = await Game.findOne({ where: { slug } });

        if (!game) {
            throw new Error('Game not found');
        }

        // Tạo mới comment
        const newComment = await Comment.create({
            user_id: userId,
            game_id: game.game_id,
            content,
            time: new Date(), // Lấy thời gian hiện tại
        });

        return newComment;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getCommentsBySlug = async (slug) => {
    try {
        // Tìm game dựa trên slug
        const game = await Game.findOne({ where: { slug } });

        if (!game) {
            throw new Error('Game not found');
        }

        // Lấy danh sách comment theo game_id
        const comments = await Comment.findAll({
            where: { game_id: game.game_id },
            include: [{ model: Game, attributes: ['game_name'] }, { model: User, attributes: ['user_name'] }], // Lấy thêm thông tin tên game và username
            order: [['time', 'DESC']], // Sắp xếp comment mới nhất lên trước
        });

        return comments;
    } catch (error) {
        throw new Error(error.message);
    }
};