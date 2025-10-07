'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const invoices = users.flatMap((user, index) =>
      Array.from({ length: 10 }).map((_, i) => ({
        customer_name: `Customer ${index + 1}-${i + 1}`,
        invoice_number: `INV${index + 1}-${i + 1}`,
        order_number: `ORD${index + 1}-${i + 1}`,
        invoice_date: new Date(),
        terms: `Net 30`,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        salesperson: `Salesperson ${index + 1}`,
        item_name: `Item ${index + 1}-${i + 1}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        rate: (Math.random() * 100).toFixed(2),
        discount: (Math.random() * 10).toFixed(2),
        amount: (Math.random() * 1000).toFixed(2),
        customer_notes: `Notes for Customer ${index + 1}-${i + 1}`,
        terms_conditions: `Terms for Customer ${index + 1}-${i + 1}`,
        user_id: user.id,
      }))
    );

    await queryInterface.bulkInsert('invoices', invoices, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('invoices', null, {});
  },
};
