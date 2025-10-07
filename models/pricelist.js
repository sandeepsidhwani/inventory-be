'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PriceList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      PriceList.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  PriceList.init({
    name: DataTypes.STRING,
    transaction_type: DataTypes.STRING,
    price_list_type: DataTypes.STRING,
    description: DataTypes.TEXT,
    pricing_scheme: DataTypes.STRING,
    currency_value: DataTypes.STRING,
    discount: DataTypes.DECIMAL,
    percentage: DataTypes.FLOAT,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PriceList',
    tableName: 'price_lists',
    timestamps: false,
  });
  return PriceList;
};