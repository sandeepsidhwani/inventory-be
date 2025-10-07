module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all users from the Users table
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Generate 10 vendor records for each user
    const vendors = [];
    users.forEach((user) => {
      for (let i = 1; i <= 10; i++) {
        vendors.push({
          company_name: `Company ${i} for User ${user.id}`,
          display_name: `Display Name ${i}`,
          vendor_email: `vendor${i}@user${user.id}.example.com`,
          vendor_phone: `12345678${i}`,
          currency: 'USD',
          payment_terms: `Net ${30 + i}`,
          address: `Address ${i} for User ${user.id}`,
          bank_account_number: `12345678${i}`,
          bank_ifsc_number: `IFSC123${i}`,
          bank_name: `Bank ${i}`,
          bank_account_holder_name: `Account Holder ${i}`,
          remarks: `Remarks for vendor ${i} of user ${user.id}`,
          user_id: user.id,
        });
      }
    });

    // Bulk insert all generated vendor records
    await queryInterface.bulkInsert('vendors', vendors);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all records from the Vendors table
    await queryInterface.bulkDelete('vendors', null, {});
  },
};
