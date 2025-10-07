'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: Sequelize.INTEGER,
      customer_name: Sequelize.STRING,
      sales_order_number: Sequelize.STRING,
      reference_number: Sequelize.STRING,
      sales_order_date: Sequelize.DATE,
      expected_shipment_date: Sequelize.DATE,
      payment_terms: Sequelize.STRING,
      delivery_method: Sequelize.STRING,
      salesperson: Sequelize.STRING,
      item_name: Sequelize.STRING,
      quantity: Sequelize.INTEGER,
      rate: Sequelize.DECIMAL,
      discount: Sequelize.DECIMAL,
      amount: Sequelize.DECIMAL,
      customer_notes: Sequelize.TEXT,
      terms_conditions: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales_orders');
  },
};
