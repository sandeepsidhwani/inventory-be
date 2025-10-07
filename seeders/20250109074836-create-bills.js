'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch all user IDs
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Generate 10 bills per user
    const bills = users.flatMap((user, index) =>
      Array.from({ length: 10 }).map((_, i) => ({
        vendor_name: `Vendor ${index + 1}-${i + 1}`,
        bill_no: `BILL${index + 1}-${i + 1}`,
        order_no: `ORD${index + 1}-${i + 1}`,
        bill_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
        item_name: `Item ${index + 1}-${i + 1}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        rate: (Math.random() * 100).toFixed(2),
        discount: (Math.random() * 10).toFixed(2),
        tds: (Math.random() * 5).toFixed(2),
        total: (Math.random() * 1000).toFixed(2),
        user_id: user.id, // Associate bill with the user
      }))
    );

    // Insert the bills into the database
    await queryInterface.bulkInsert('bills', bills, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove all inserted bills
    await queryInterface.bulkDelete('bills', null, {});
  },
};
