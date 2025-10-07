'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const vendorAdvances = [];
    users.forEach((user) => {
      for (let i = 1; i <= 10; i++) {
        vendorAdvances.push({
          vendor_name: `Vendor ${i} for User ${user.id}`,
          payment_number: `PMT-${user.id}-${i}`,
          payment_made: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
          bank_charges: parseFloat((Math.random() * 50).toFixed(2)),
          payment_date: new Date(),
          payment_mode: ['Bank Transfer', 'Cash', 'Credit Card'][i % 3],
          paid_through: ['Bank A', 'Bank B', 'Bank C'][i % 3],
          deposit_to: ['Account A', 'Account B', 'Account C'][i % 3],
          reference_number: `REF-${user.id}-${i}`,
          user_id: user.id,
        });
      }
    });

    await queryInterface.bulkInsert('vendor_advances', vendorAdvances);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vendor_advances', null, {});
  },
};
