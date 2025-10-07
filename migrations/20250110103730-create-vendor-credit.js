'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendor_credits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Reference Users table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      vendor_name: {
        type: Sequelize.STRING,
      },
      credit_note_number: {
        type: Sequelize.STRING,
      },
      order_number: {
        type: Sequelize.STRING,
      },
      vendor_credit_date: {
        type: Sequelize.DATE,
      },
      item_name: {
        type: Sequelize.STRING,
      },
      account: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      rate: {
        type: Sequelize.DECIMAL(10, 2),
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      notes: {
        type: Sequelize.STRING,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vendor_credits');
  },
};
