import { Vote} from '../Models/vote_model.js';
import {Game} from "../Models/game_model.js";
import { User } from '../Models/user_model.js';
import { Sequelize} from "sequelize";

export const addVote = async (userId, slug, rating) => {
    try {
        // Kiểm tra giá trị rating
        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        // Tìm game dựa trên slug
        const game = await Game.findOne({ where: { slug } });

        if (!game) {
            throw new Error('Game not found');
        }

        // Kiểm tra nếu user đã vote cho game này
        const existingVote = await Vote.findOne({
            where: {
                user_id: userId,
                game_id: game.game_id,
            },
        });

        if (existingVote) {
            // Cập nhật rating nếu đã tồn tại
            existingVote.rating = rating;
            existingVote.time = new Date(); // Cập nhật thời gian hiện tại
            await existingVote.save();
            return existingVote;
        } else {
            // Tạo mới vote nếu chưa tồn tại
            const newVote = await Vote.create({
                user_id: userId,
                game_id: game.game_id,
                rating,
                time: new Date(),
            });
            return newVote;
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getAverageRating = async (slug) => {
    try {
        // Tìm game dựa trên slug
        const game = await Game.findOne({ where: { slug } });

        if (!game) {
            throw new Error('Game not found');
        }

        // Tính trung bình và tổng số lượng rating cho game
        const ratingsData = await Vote.findAll({
            where: { game_id: game.game_id },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
                [Sequelize.fn('COUNT', Sequelize.col('rating')), 'totalRatings']
            ],
            raw: true,
        });

        return ratingsData[0]; // Trả về kết quả trung bình và tổng số rating
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getUserRating = async (userId, slug) => {
    try {
        // Tìm game dựa trên slug
        const game = await Game.findOne({ where: { slug } });

        if (!game) {
            throw new Error('Game not found');
        }

        // Tìm rating của người dùng cho game đó
        const userVote = await Vote.findOne({
            where: {
                user_id: userId,
                game_id: game.game_id,
            },
            attributes: ['rating'], // Chỉ lấy trường rating
        });

        return userVote ? userVote.rating : null; // Trả về rating hoặc null nếu chưa có đánh giá
    } catch (error) {
        throw new Error(error.message);
    }
};