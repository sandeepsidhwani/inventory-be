'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VendorAdvance extends Model {
    static associate(models) {
      // Associate VendorAdvance with User
      VendorAdvance.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  VendorAdvance.init(
    {
      vendor_name: DataTypes.STRING,
      payment_number: DataTypes.STRING,
      payment_made: DataTypes.DECIMAL,
      bank_charges: DataTypes.DECIMAL,
      payment_date: DataTypes.DATE,
      payment_mode: DataTypes.STRING,
      paid_through: DataTypes.STRING,
      deposit_to: DataTypes.STRING,
      reference_number: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'VendorAdvance',
      tableName: 'vendor_advances',
      timestamps: false,
    }
  );

  return VendorAdvance;
};
