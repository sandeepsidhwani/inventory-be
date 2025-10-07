'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const vendorCredits = [];
    users.forEach((user) => {
      for (let i = 1; i <= 10; i++) {
        vendorCredits.push({
          vendor_name: `Vendor ${i} for User ${user.id}`,
          credit_note_number: `CN-${user.id}-${i}`,
          order_number: `ORD-${user.id}-${i}`,
          vendor_credit_date: new Date(),
          item_name: `Item ${i}`,
          account: `Account ${i}`,
          quantity: Math.floor(Math.random() * 100) + 1,
          rate: parseFloat((Math.random() * 100).toFixed(2)),
          amount: parseFloat((Math.random() * 1000).toFixed(2)),
          discount: parseFloat((Math.random() * 50).toFixed(2)),
          notes: `Notes for Credit ${i}`,
          user_id: user.id,
        });
      }
    });

    await queryInterface.bulkInsert('vendor_credits', vendorCredits);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vendor_credits', null, {});
  },
};
