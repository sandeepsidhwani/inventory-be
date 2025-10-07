'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('challans', {
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
      customer_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      challan_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      challan_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      challan_type: {
        type: Sequelize.STRING,
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
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      customer_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      terms_condition: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
     
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('challans');
  },
};
