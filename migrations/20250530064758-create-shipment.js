'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shipments', {
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
      sales_order: {
        type: Sequelize.STRING
      },
      package: {
        type: Sequelize.STRING
      },
      shipment_order: {
        type: Sequelize.STRING
      },
      ship_date: {
        type: Sequelize.DATE
      },
      carrier: {
        type: Sequelize.STRING
      },
      tracking: {
        type: Sequelize.STRING
      },
      tracking_url: {
        type: Sequelize.STRING
      },
      shipping_charges: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('shipments');
  }
};