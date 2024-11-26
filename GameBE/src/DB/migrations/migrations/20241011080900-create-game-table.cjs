'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('games', {
      game_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users', // Bảng 'user' được tham chiếu
          key: 'user_id', // Khóa chính của bảng 'user'
        },
        onDelete: 'SET NULL', // Xóa user thì set user_id thành null trong game
        onUpdate: 'CASCADE', // Cập nhật user thì cập nhật user_id trong game
      },
      game_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      game_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      date_release: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      player_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      player_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      genres: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      file_path: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image_file_path: {
        type: Sequelize.STRING(255),
        allowNull: true, // Có thể là null
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('games');
  },
};
