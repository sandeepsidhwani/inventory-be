'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_receiveds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      customer_name: {
        type: Sequelize.STRING
      },
      amount_received: {
        type: Sequelize.FLOAT
      },
      bank_charge: {
        type: Sequelize.FLOAT
      },
      payment_date: {
        type: Sequelize.DATE
      },
      payment: {
        type: Sequelize.STRING
      },
      payment_mode: {
        type: Sequelize.STRING
      },
      deposit_to: {
        type: Sequelize.STRING
      },
      reference: {
        type: Sequelize.STRING
      },
      tax_deducted: {
        type: Sequelize.FLOAT
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payment_receiveds');
  }
};