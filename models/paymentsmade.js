'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentsMade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PaymentsMade.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  PaymentsMade.init({
    date: DataTypes.DATE,
    payment: DataTypes.STRING,
    reference: DataTypes.STRING,
    vendor_name: DataTypes.STRING,
    bill: DataTypes.STRING,
    mode: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    unused_amount: DataTypes.DECIMAL,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PaymentsMade',
    tableName: 'payments_mades',
    timestamps: false,
  });
  return PaymentsMade;
};