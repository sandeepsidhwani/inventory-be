'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseOrder extends Model {
    static associate(models) {
      // Define association here
      PurchaseOrder.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  PurchaseOrder.init(
    {
      vendor_name: DataTypes.STRING,
      delivery_address: DataTypes.STRING,
      purchase_order_number: DataTypes.STRING,
      reference_number: DataTypes.STRING,
      date: DataTypes.DATE,
      expected_delivery_date: DataTypes.DATE,
      payment_terms: DataTypes.STRING,
      shipment_preference: DataTypes.STRING,
      item_name: DataTypes.STRING,
      account: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      rate: DataTypes.DECIMAL,
      amount: DataTypes.DECIMAL,
      discount: DataTypes.DECIMAL,
      discount_account: DataTypes.STRING,
      customer_notes: DataTypes.TEXT,
      terms_conditions: DataTypes.TEXT,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'PurchaseOrder',
      tableName: 'purchase_orders',
      timestamps:false
    }
  );

  return PurchaseOrder;
};
