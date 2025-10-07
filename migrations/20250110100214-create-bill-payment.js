'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bill_payments', {
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
          model: 'users', // Name of the Users table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      vendor_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payment_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payment_made: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      bank_charges: {
        type: Sequelize.DECIMAL,
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      payment_mode: {
        type: Sequelize.STRING,
      },
      paid_through: {
        type: Sequelize.STRING,
      },
      reference_number: {
        type: Sequelize.STRING,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bill_payments');
  },
};
