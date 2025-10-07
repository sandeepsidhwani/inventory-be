'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VendorCredit extends Model {
    static associate(models) {
      // Associate VendorCredit with User
      VendorCredit.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  VendorCredit.init(
    {
      vendor_name: DataTypes.STRING,
      credit_note_number: DataTypes.STRING,
      order_number: DataTypes.STRING,
      vendor_credit_date: DataTypes.DATE,
      item_name: DataTypes.STRING,
      account: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      rate: DataTypes.DECIMAL(10, 2),
      amount: DataTypes.DECIMAL(10, 2),
      discount: DataTypes.DECIMAL(10, 2),
      notes: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'VendorCredit',
      tableName: 'vendor_credits',
      timestamps: false, // Automatically adds createdAt and updatedAt
    }
  );

  return VendorCredit;
};
