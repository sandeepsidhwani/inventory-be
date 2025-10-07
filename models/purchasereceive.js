'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PurchaseReceive extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      PurchaseReceive.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  PurchaseReceive.init({
    date: DataTypes.DATEONLY,
    purchase_receive: DataTypes.STRING,
    purchase_order: DataTypes.STRING,
    vendor_name: DataTypes.STRING,
    status: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PurchaseReceive',
    tableName: 'purchase_receives',
    timestamps: false,
  });
  return PurchaseReceive;
};