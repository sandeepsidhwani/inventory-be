'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch user IDs dynamically from the database
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const billPayments = [];

    users.forEach((user) => {
      for (let i = 1; i <= 10; i++) {
        billPayments.push({
          vendor_name: `Vendor ${i} for User ${user.id}`,
          payment_number: `PMT-${user.id}-${i}`,
          payment_made: parseFloat((Math.random() * 1000 + 100).toFixed(2)), // Random payment between 100 and 1100
          bank_charges: parseFloat((Math.random() * 50).toFixed(2)), // Random bank charges between 0 and 50
          payment_date: new Date(),
          payment_mode: ['Bank Transfer', 'Cash', 'Credit Card'][i % 3], // Cycle through payment modes
          paid_through: ['Bank A', 'Bank B', 'Bank C'][i % 3], // Cycle through paid-through options
          reference_number: `REF-${user.id}-${i}`,
          user_id: user.id,
        });
      }
    });

    await queryInterface.bulkInsert('bill_payments', billPayments);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bill_payments', null, {});
  },
};
