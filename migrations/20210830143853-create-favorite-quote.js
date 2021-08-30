'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FavoriteQuotes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quote: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      tag: {
        type: Sequelize.STRING
      },
      quoteID: {
        type: Sequelize.STRING
      },
      userID: {
        type: Sequelize.INTEGER,
        references:{model:'Users',field:'id'}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FavoriteQuotes');
  }
};