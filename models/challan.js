'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Challan extends Model {
    static associate(models) {
      // Associate Challan with User
      Challan.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  Challan.init(
    {
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      challan_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      challan_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      challan_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      item_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      customer_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      terms_condition: {
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
      modelName: 'Challan',
      tableName: 'challans',
      timestamps: false,
    }
  );

  return Challan;
};
