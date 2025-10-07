'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompositeItem extends Model {
    static associate(models) {
      CompositeItem.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  CompositeItem.init({
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    unit: DataTypes.ENUM('dozen', 'box', 'grams', 'kilograms', 'meters', 'tablets', 'units'),
    selling_price: DataTypes.DECIMAL,
    account: DataTypes.ENUM(
      'Contract Assets',
      'merchandise',
      'transportation expense',
      'cost of good sold',
      'job costing',
      'labor',
      'materials'
    ),
    description: DataTypes.TEXT,
    cost_price: DataTypes.DECIMAL,
    preferred_vendor: DataTypes.STRING,
    weight: DataTypes.DECIMAL,
    manufacturer: DataTypes.STRING,
    brand: DataTypes.STRING,
    upc: DataTypes.STRING,
    mpn: DataTypes.STRING,
    ean: DataTypes.STRING,
    isbn: DataTypes.STRING,
    opening_stock_rate_per_unit: DataTypes.DECIMAL,
    opening_stock: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CompositeItem',
    tableName: 'composite_items',
    timestamps: false,
  });

  return CompositeItem;
};
