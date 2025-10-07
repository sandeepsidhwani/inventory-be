'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BillPayment extends Model {
    static associate(models) {
      // Associations
      BillPayment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  BillPayment.init(
    {
      vendor_name: DataTypes.STRING,
      payment_number: DataTypes.STRING,
      payment_made: DataTypes.DECIMAL,
      bank_charges: DataTypes.DECIMAL,
      payment_date: DataTypes.DATE,
      payment_mode: DataTypes.STRING,
      paid_through: DataTypes.STRING,
      reference_number: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'BillPayment',
      tableName: 'bill_payments',
      timestamps: false,
    }
  );

  return BillPayment;
};
