'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const types = ['type1', 'type2', 'type3'];
    const units = ['dozen', 'box', 'grams', 'kilograms', 'meters', 'tablets', 'units'];
    const manufacturers = ['Samsung', 'LG', 'Sony', 'Panasonic', 'GE'];
    const brands = ['BrandA', 'BrandB', 'BrandC'];

    const itemGroups = users.flatMap((user, userIndex) =>
      Array.from({ length: 10 }).map((_, i) => ({
        type: types[Math.floor(Math.random() * types.length)],
        item_group_name: `Group ${userIndex + 1}-${i + 1}`,
        description: `Description for Group ${userIndex + 1}-${i + 1}`,
        unit: units[Math.floor(Math.random() * units.length)],
        manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
        brand: brands[Math.floor(Math.random() * brands.length)],
        image: `group_image_${userIndex + 1}_${i + 1}.png`,
        user_id: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    await queryInterface.bulkInsert('item_groups', itemGroups, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('item_groups', null, {});
  }
};
