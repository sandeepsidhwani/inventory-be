// models/adjustment.js
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Adjustment extends Model {
    static associate(models) {
      // Define associations here, if needed
      Adjustment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  Adjustment.init(
    {
      mode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      account: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      item_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      new_quantity_on_hand: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity_adjusted: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Adjustment',
      tableName: 'adjustments',
      timestamps: false,
    }
  );

  return Adjustment;
};
