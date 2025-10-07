'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const creditNotes = users.flatMap((user, userIndex) =>
      Array.from({ length: 10 }).map((_, i) => ({
        customer_name: `Customer ${userIndex + 1}-${i + 1}`,
        credit_note_number: `CN-${userIndex + 1}-${i + 1}`,
        reference_number: `REF-${userIndex + 1}-${i + 1}`,
        credit_note_date: new Date(),
        salesperson: `Salesperson ${userIndex + 1}`,
        item_name: `Item ${i + 1}`,
        account: `Account-${i + 1}`,
        quantity: Math.ceil(Math.random() * 10),
        rate: (Math.random() * 100).toFixed(2),
        discount: (Math.random() * 10).toFixed(2),
        amount: (Math.random() * 1000).toFixed(2),
        customer_notes: `Notes for CN-${userIndex + 1}-${i + 1}`,
        terms_conditions: `Terms for CN-${userIndex + 1}-${i + 1}`,
        user_id: user.id,
      }))
    );

    await queryInterface.bulkInsert('credit_notes', creditNotes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('credit_notes', null, {});
  },
};
