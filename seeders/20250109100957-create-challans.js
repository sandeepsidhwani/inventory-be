'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const challans = users.flatMap((user, index) =>
      Array.from({ length: 10 }).map((_, i) => ({
        customer_name: `Customer ${index + 1}-${i + 1}`,
        challan_number: `CHALLAN${index + 1}-${i + 1}`,
        challan_date: new Date(),
        challan_type: `Type ${index + 1}`,
        item_name: `Item ${index + 1}-${i + 1}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        rate: (Math.random() * 100).toFixed(2),
        discount: (Math.random() * 10).toFixed(2),
        total: (Math.random() * 1000).toFixed(2),
        customer_notes: `Notes for Customer ${index + 1}-${i + 1}`,
        terms_condition: `Terms for Customer ${index + 1}-${i + 1}`,
        user_id: user.id,
      }))
    );

    await queryInterface.bulkInsert('challans', challans, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('challans', null, {});
  },
};
