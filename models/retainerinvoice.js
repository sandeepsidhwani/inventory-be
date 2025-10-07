'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RetainerInvoice extends Model {
    static associate(models) {
      // Define associations
      RetainerInvoice.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  RetainerInvoice.init(
    {
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      retainer_invoice_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reference_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      retainer_invoice_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      email_communications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RetainerInvoice',
      tableName: 'retainer_invoices',
      timestamps: false,
    }
  );

  return RetainerInvoice;
};
