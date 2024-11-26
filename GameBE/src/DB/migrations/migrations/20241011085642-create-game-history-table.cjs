'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('game_history', {
      history_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Tự động tăng
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Có thể là null
        references: {
          model: 'users', // Bảng tham chiếu 'user'
          key: 'user_id', // Khóa chính của bảng 'user'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Có thể là null
        references: {
          model: 'games', // Bảng tham chiếu 'game'
          key: 'game_id', // Khóa chính của bảng 'game'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      played_time: {
        type: Sequelize.DATEONLY, // Định dạng ngày
        allowNull: true, // Có thể là null
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('game_history');
  },
};
