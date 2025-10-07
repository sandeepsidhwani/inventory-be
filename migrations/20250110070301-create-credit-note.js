'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('credit_notes', {
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
          model: 'users', // Ensure the table name is correct
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      customer_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      credit_note_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reference_number: {
        type: Sequelize.STRING,
      },
      credit_note_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      salesperson: {
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
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      discount: {
        type: Sequelize.FLOAT,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      customer_notes: {
        type: Sequelize.TEXT,
      },
      terms_conditions: {
        type: Sequelize.TEXT,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('credit_notes');
  },
};
