'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      Invoice.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  Invoice.init(
    {
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      invoice_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      order_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      invoice_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      terms: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      salesperson: {
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
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      customer_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      terms_conditions: {
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
      modelName: 'Invoice',
      tableName: 'invoices',
      timestamps: false,
    }
  );
  return Invoice;
};
