'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('composite_items', {
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
      name: { type: Sequelize.STRING, allowNull: false },
      sku: { type: Sequelize.STRING, unique: true },
      unit: {
        type: Sequelize.ENUM('dozen', 'box', 'grams', 'kilograms', 'meters', 'tablets', 'units'),
        allowNull: false
      },
      selling_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      account: {
        type: Sequelize.ENUM(
          'Contract Assets',
          'merchandise',
          'transportation expense',
          'cost of good sold',
          'job costing',
          'labor',
          'materials'
        ),
        allowNull: false
      },
      description: { type: Sequelize.TEXT },
      cost_price: { type: Sequelize.DECIMAL(10, 2) },
      preferred_vendor: { type: Sequelize.STRING },
      weight: { type: Sequelize.DECIMAL(10, 2) },
      manufacturer: { type: Sequelize.STRING },
      brand: { type: Sequelize.STRING },
      upc: { type: Sequelize.STRING },
      mpn: { type: Sequelize.STRING },
      ean: { type: Sequelize.STRING },
      isbn: { type: Sequelize.STRING },
      opening_stock_rate_per_unit: { type: Sequelize.DECIMAL(10, 2) },
      opening_stock: { type: Sequelize.INTEGER },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('composite_items');
  }
};
