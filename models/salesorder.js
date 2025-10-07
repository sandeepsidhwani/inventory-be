'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesOrder extends Model {
    static associate(models) {
      SalesOrder.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  SalesOrder.init(
    {
      customer_name: DataTypes.STRING,
      sales_order_number: DataTypes.STRING,
      reference_number: DataTypes.STRING,
      sales_order_date: DataTypes.DATE,
      expected_shipment_date: DataTypes.DATE,
      payment_terms: DataTypes.STRING,
      delivery_method: DataTypes.STRING,
      salesperson: DataTypes.STRING,
      item_name: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      rate: DataTypes.DECIMAL,
      discount: DataTypes.DECIMAL,
      amount: DataTypes.DECIMAL,
      customer_notes: DataTypes.TEXT,
      terms_conditions: DataTypes.TEXT,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'SalesOrder',
      tableName: 'sales_orders',
      timestamps: false,
    }
  );
  return SalesOrder;
};
