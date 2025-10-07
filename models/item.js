'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      // Associate Item with User
      Item.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  Item.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      manufacturer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Item',
      tableName: 'items',
      timestamps: false,
    }
  );

  return Item;
};
