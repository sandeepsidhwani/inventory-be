'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch all user IDs from the database
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Generate dummy items for each user
    const items = users.flatMap((user, index) =>
      Array.from({ length: 10 }).map((_, i) => ({
        type: `Type ${index + 1}-${i + 1}`,
        name: `Item ${index + 1}-${i + 1}`,
        unit: `Unit ${index + 1}-${i + 1}`,
        weight: (Math.random() * 10).toFixed(2),
        manufacturer: `Manufacturer ${index + 1}`,
        selling_price: (Math.random() * 100).toFixed(2),
        cost_price: (Math.random() * 80).toFixed(2),
        description: `Description for Item ${index + 1}-${i + 1}`,
        user_id: user.id,
      }))
    );

    // Insert the dummy items into the database
    await queryInterface.bulkInsert('items', items, {});
  },

  async down(queryInterface, Sequelize) {
    // Delete all records from the items table
    await queryInterface.bulkDelete('items', null, {});
  },
};
