'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ItemGroup.init({
    type: DataTypes.STRING,
    item_group_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    unit: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    brand: DataTypes.STRING,
    image: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ItemGroup',
    tableName: 'item_groups',
  });
  return ItemGroup;
};