'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendor_advances', {
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
          model: 'users', // Ensure this matches your users table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      vendor_name: {
        type: Sequelize.STRING,
      },
      payment_number: {
        type: Sequelize.STRING,
      },
      payment_made: {
        type: Sequelize.DECIMAL(10, 2),
      },
      bank_charges: {
        type: Sequelize.DECIMAL(10, 2),
      },
      payment_date: {
        type: Sequelize.DATE,
      },
      payment_mode: {
        type: Sequelize.STRING,
      },
      paid_through: {
        type: Sequelize.STRING,
      },
      deposit_to: {
        type: Sequelize.STRING,
      },
      reference_number: {
        type: Sequelize.STRING,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vendor_advances');
  },
};
