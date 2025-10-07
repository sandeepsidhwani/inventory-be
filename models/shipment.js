'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shipment.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Shipment.init({
    customer_name: DataTypes.STRING,
    sales_order: DataTypes.STRING,
    package: DataTypes.STRING,
    shipment_order: DataTypes.STRING,
    ship_date: DataTypes.DATE,
    carrier: DataTypes.STRING,
    tracking: DataTypes.STRING,
    tracking_url: DataTypes.STRING,
    shipping_charges: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Shipment',
    tableName: 'shipments',
    timestamps: false,
  });
  return Shipment;
};