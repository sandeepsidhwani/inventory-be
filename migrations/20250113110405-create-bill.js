'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bills', {
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
      bill_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      order_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bill_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      tds: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bills');
  },
};
