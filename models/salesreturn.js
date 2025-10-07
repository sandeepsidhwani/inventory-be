'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesReturn extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      SalesReturn.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  SalesReturn.init({
    date: DataTypes.DATEONLY,
    rma: DataTypes.STRING,
    sales_order: DataTypes.STRING,
    customer_name: DataTypes.STRING,
    status: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SalesReturn',
    tableName: 'sales_returns',
    timestamps: false,
  });
  return SalesReturn;
};