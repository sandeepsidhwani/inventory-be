'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CreditNote extends Model {
    static associate(models) {
      CreditNote.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  CreditNote.init(
    {
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      credit_note_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reference_number: {
        type: DataTypes.STRING,
      },
      credit_note_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      salesperson: {
        type: DataTypes.STRING,
      },
      item_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      discount: {
        type: DataTypes.FLOAT,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      customer_notes: {
        type: DataTypes.TEXT,
      },
      terms_conditions: {
        type: DataTypes.TEXT,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CreditNote',
      tableName: 'credit_notes',
      timestamps: false,
    }
  );

  return CreditNote;
};
