'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Define associations here.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Example association: Vendor belongs to a User
      Vendor.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user', // Alias for the association
      });

      // Additional associations can be added here if needed
    }
  }

  // Initialize the Vendor model
  Vendor.init(
    {
      company_name: {
        type: DataTypes.STRING,
        allowNull: false, // This field is required
      },
      display_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vendor_email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true, // Validate as a proper email format
        },
      },
      vendor_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_terms: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bank_account_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bank_ifsc_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bank_account_holder_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // This field is required for the association
      },
    },
    {
      sequelize,
      modelName: 'Vendor',
      tableName: 'vendors',
      timestamps: false,
    }
  );

  return Vendor;
};
