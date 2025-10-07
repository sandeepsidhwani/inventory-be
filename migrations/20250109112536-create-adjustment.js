'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('adjustments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      mode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reference_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      account: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity_available: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      new_quantity_on_hand: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity_adjusted: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('adjustments');
  },
};
