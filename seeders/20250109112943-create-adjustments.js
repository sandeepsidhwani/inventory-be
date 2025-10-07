'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch user IDs
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const adjustments = users.flatMap((user, index) =>
      Array.from({ length: 10 }).map((_, i) => ({
        mode: `Mode ${index + 1}-${i + 1}`,
        reference_number: `REF${index + 1}-${i + 1}`,
        date: new Date(),
        account: `Account ${index + 1}`,
        reason: `Reason ${index + 1}`,
        description: `Description for Adjustment ${index + 1}-${i + 1}`,
        item_name: `Item ${index + 1}`,
        quantity_available: Math.floor(Math.random() * 50) + 1,
        new_quantity_on_hand: Math.floor(Math.random() * 50) + 1,
        quantity_adjusted: Math.floor(Math.random() * 20) + 1,
        user_id: user.id,
      }))
    );

    await queryInterface.bulkInsert('adjustments', adjustments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('adjustments', null, {});
  },
};
