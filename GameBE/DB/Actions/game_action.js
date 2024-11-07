import {Game} from "../Models/game_model.js";
import {User} from "../Models/user_model.js";
import {GameHistory} from "../Models/game_history_model.js"
import { Op,Sequelize} from "sequelize";
import slugify from 'slugify';
import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';

// Hàm lấy thông tin game theo ID
export const findGameById = async (id) => {
    try {
        const game = await Game.findByPk(id,{
            include: [{
                model: User, // Tham chiếu tới model User
                attributes: ['user_name'], // Chỉ lấy trường user_name
            }]
        });
        return game;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Hàm lấy tất cả các game
export const findAllGames = async () => {
    try {
        const games = await Game.findAll({
            include: [{
            model: User, // Tham chiếu tới model User
            attributes: ['user_name'], // Chỉ lấy trường user_name
        }]});
        return games;       
    } catch (error) {
        throw new Error(error.message);
    }
};

// Hàm truy vấn lấy game từ CSDL với limit và offset
export const findGames = async (limit, offset) => {
    try {
        const games = await Game.findAll({
            limit: limit,
            offset: offset,
            include: [{
                model: User, // Tham chiếu tới model User
                attributes: ['user_name'] // Chỉ lấy trường user_name
            }]
        });
        return games;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Hàm tính tổng số game trong cơ sở dữ liệu
export const countTotalGames = async () => {
    try {
        const totalGames = await Game.count();
        return totalGames;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const findGamesbyName = async (query) => {
  try {
    const games = await Game.findAll({
      where: {
        [Op.or]: [
          {
            game_name: {
              [Op.like]: `%${query}%`,  // Tìm kiếm theo tên game
            },
          },
          {
            game_description: {
              [Op.like]: `%${query}%`,  // Tìm kiếm trong mô tả game
            },
          },
        ],
      },

      order: [
        // Sắp xếp dựa trên sự xuất hiện của từ khóa trong tên game trước
        [Sequelize.literal(`CASE WHEN game_name LIKE '%${query}%' THEN 1 ELSE 2 END`), 'ASC'],
      ],
      include: [{
        model: User, // Tham chiếu tới model User
        attributes: ['user_name'], // Chỉ lấy trường user_name
      }],
    });
    return games;
  } catch (error) {
    throw new Error(error.message);
  }
};
  
export const countTotalGamesByName = async (query) => {
  try {
    const totalGames = await Game.count({
      where: {
        [Op.or]: [
          {
            game_name: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            game_description: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
    });
    return totalGames;
  } catch (error) {
    throw new Error('Error counting games: ' + error.message);
  }
};

// Hàm tìm kiếm game với nhiều điều kiện
export const searchGamesWithFilters = async (query, filters, limit, offset) => {
    try {
        const { genres, user_id, player_number } = filters;

        // Xây dựng điều kiện tìm kiếm theo tên game
        const whereClause = {};

        if (query) {
            whereClause.game_name = {
                [Op.like]: `%${query}%`,  // Tìm kiếm theo tên game nếu có query
            };
        }

        // Thêm điều kiện genres nếu có
        if (genres) {
            whereClause.genres = genres;
        }

        // Thêm điều kiện user_id nếu có
        if (user_id) {
            whereClause.user_id = user_id;
        }

        // Thêm điều kiện player_number nếu có
        if (player_number) {
            whereClause.player_number = player_number;
        }

        // Tìm game dựa trên điều kiện
        const games = await Game.findAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            include: [{
                model: User, // Tham chiếu tới model User
                attributes: ['user_name'], // Chỉ lấy trường user_name
            }],
        });

        // Đếm tổng số game cho phân trang
        const totalCount = await Game.count({ where: whereClause });

        return { games, totalCount }; // Trả về game và tổng số lượng
    } catch (error) {
        throw new Error(error.message);
    }
};

// Hàm đếm số lượng game theo player_number
export const countGamesByPlayerNumber = async () => {
    try {
        const result = await Game.findAll({
            attributes: [
                'player_number',
                [Sequelize.fn('COUNT', Sequelize.col('player_number')), 'count']
            ],
            group: ['player_number']
        });

        const response = {};
        result.forEach(row => {
            const playerNumber = `${row.player_number} player`; // Đặt tên theo player_number
            response[playerNumber] = row.dataValues.count;
        });

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Hàm đếm số lượng game theo genres (trường genre trong bảng game)
export const countGamesByGenre = async () => {
    try {
        const result = await Game.findAll({
            attributes: [
                'genres', // Trường genres trong model Game
                [Sequelize.fn('COUNT', Sequelize.col('genres')), 'count']
            ],
            group: ['genres']
        });

        const response = {};
        result.forEach(row => {
            const genreName = row.genres; // Lấy tên của genres
            response[genreName] = row.dataValues.count;
        });

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Hàm đếm số lượng game theo user_id và lấy user_name
export const countGamesByUser = async () => {
    try {
        const result = await Game.findAll({
            attributes: [
                'user_id',
                [Sequelize.fn('COUNT', Sequelize.col('user_id')), 'count']
            ],
            group: ['user_id']
        });

        const response = [];
        for (const row of result) {
            const userId = row.user_id;

            // Lấy tên người dùng từ bảng User
            const user = await User.findOne({
                attributes: ['user_name'],
                where: { user_id: userId }
            });

            if (user) {
                const userName = user.user_name; // Lấy tên người dùng
                response.push({
                    user_id: userId,      // Thêm user_id vào response
                    user_name: userName,  // Thêm user_name vào response
                    count: row.dataValues.count // Số lượng game của user
                });
            }
        }

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const findSimilarGame = async(id)=>{
    try {
        const currentGame =await Game.findByPk(id);
        // if(!currentGame){
        //     throw new Error(`Game with ID ${id} not found`);
        // }
        const currentGenres= currentGame.genres;

        const similarGames= await Game.findAll({
            where: {
                genres: currentGenres,
                game_id: { [Op.ne]: id } // Loại bỏ game hiện tại khỏi kết quả
            },
            include: [{
                model: User, // Tham chiếu tới model User
                attributes: ['user_name'], // Chỉ lấy trường user_name
            }]
        });

        return similarGames;
    }catch(error){
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

export const findGamesByUserId = async (user_id, limit, offset) => {
    try {
        const myGame = await Game.findAll({
            where: { user_id },
            limit:limit,
            offset:offset,
            include:[
                        {
                        model: User, // Tham chiếu tới model User
                        attributes: ['user_name'] // Chỉ lấy trường user_name
                        },
                    ],
                },);

        // Đếm tổng số game dựa trên lịch sử của user để tính tổng số trang
        const totalGames = await Game.count({ where: { user_id } });
        return { myGame, totalGames };
    } catch (error) {
        throw new Error(error.message);
    }
};


// Hàm cập nhật thông tin game theo ID
export const updateGame = async (id, gameData) => {
    try {
        // Tìm game theo ID
        const game = await Game.findByPk(id);
        if (!game) {
            throw new Error('Game not found'); // Nếu không tìm thấy game
        }

        // Cập nhật thông tin game
        await game.update(gameData);

        return game; // Trả về game đã được cập nhật
    } catch (error) {
        throw new Error(error.message); // Bắt lỗi và truyền lại thông báo lỗi
    }
};


// Hàm tạo game và lưu trữ thư mục
export const addGame = async (gameData, zipFilePath, imageFilePath) => {
    const { user_id, game_name, game_description, instructions, date_release, player_number, genres } = gameData;

    // Tạo slug từ game_name
    const slug = `${slugify(game_name, { lower: true, strict: true })}-${Date.now()}`;

    // Thêm game vào cơ sở dữ liệu để lấy game_id
    const newGame = await Game.create({
        user_id,
        game_name,
        game_description,
        instructions,
        player_number,
        genres,
        slug
    });

    const game_id = newGame.game_id;

    // Tạo thư mục đích với tên slug
    const folderName = `${slugify(game_name, { lower: true, strict: true })}-${game_id}`;
    const destinationPath = path.join('public/games', folderName);

    // Tạo thư mục đích nếu chưa tồn tại
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
    }

    // Giải nén file zip vào thư mục đích
    await new Promise((resolve, reject) => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: destinationPath }))
            .on('close', resolve)
            .on('error', reject);
    });

    // Xóa file zip sau khi giải nén
    fs.unlinkSync(zipFilePath);

    // Sao chép file ảnh thumbnail vào thư mục đích
    const thumbnailPath = path.join(destinationPath, 'thumbnail.png');
    fs.copyFileSync(imageFilePath, thumbnailPath);

    // Xóa file ảnh tạm sau khi sao chép
    fs.unlinkSync(imageFilePath);

    // Cập nhật đường dẫn file_path và image_file_path trong cơ sở dữ liệu
    await newGame.update({
        file_path: `/games/${folderName}/index.html`,
        image_file_path: `/games/${folderName}/thumbnail.png`,
        slug: folderName
    });

    return newGame;
};
