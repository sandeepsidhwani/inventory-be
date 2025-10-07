'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentReceived extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      PaymentReceived.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  PaymentReceived.init({
    customer_name: DataTypes.STRING,
    amount_received: DataTypes.FLOAT,
    bank_charge: DataTypes.FLOAT,
    payment_date: DataTypes.DATE,
    payment: DataTypes.STRING,
    payment_mode: DataTypes.STRING,
    deposit_to: DataTypes.STRING,
    reference: DataTypes.STRING,
    tax_deducted: DataTypes.FLOAT,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PaymentReceived',
    tableName: 'payment_receiveds',
    timestamps: false,
  });
  return PaymentReceived;
};