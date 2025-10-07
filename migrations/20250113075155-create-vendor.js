module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      company_name: {
        type: Sequelize.STRING,
      },
      display_name: {
        type: Sequelize.STRING,
      },
      vendor_email: {
        type: Sequelize.STRING,
      },
      vendor_phone: {
        type: Sequelize.STRING,
      },
      currency: {
        type: Sequelize.STRING,
      },
      payment_terms: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      bank_account_number: {
        type: Sequelize.STRING,
      },
      bank_ifsc_number: {
        type: Sequelize.STRING,
      },
      bank_name: {
        type: Sequelize.STRING,
      },
      bank_account_holder_name: {
        type: Sequelize.STRING,
      },
      remarks: {
        type: Sequelize.TEXT,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vendors');
  },
};
