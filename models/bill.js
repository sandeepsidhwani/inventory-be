'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    static associate(models) {
      // Associate Bill with User
      Bill.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  
  Bill.init(
    {
      vendor_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bill_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      order_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bill_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
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
      tds: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Bill',
      tableName: 'bills',
      timestamps: false, // Disable timestamps if not required
    }
  );

  return Bill;
};
