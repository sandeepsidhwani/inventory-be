'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchase_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vendor_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      delivery_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      purchase_order_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      reference_number: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expected_delivery_date: {
        type: Sequelize.DATE,
      },
      payment_terms: {
        type: Sequelize.STRING,
      },
      shipment_preference: {
        type: Sequelize.STRING,
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rate: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      discount: {
        type: Sequelize.DECIMAL,
      },
      discount_account: {
        type: Sequelize.STRING,
      },
      customer_notes: {
        type: Sequelize.TEXT,
      },
      terms_conditions: {
        type: Sequelize.TEXT,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchase_orders');
  },
};
