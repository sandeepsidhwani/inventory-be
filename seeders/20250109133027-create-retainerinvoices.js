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
        retainer_invoice_number: `RI-${index + 1}-${i + 1}`,
        reference_number: `REF-${index + 1}-${i + 1}`,
        retainer_invoice_date: new Date(),
        description: `Description for retainer invoice ${index + 1}-${i + 1}`,
        amount: (Math.random() * 1000).toFixed(2),
        customer_notes: `Customer notes ${index + 1}-${i + 1}`,
        terms_conditions: `Terms for ${index + 1}-${i + 1}`,
        email_communications: Math.random() > 0.5,
        user_id: user.id,
      }))
    );

    await queryInterface.bulkInsert('retainer_invoices', invoices, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('retainer_invoices', null, {});
  },
};
