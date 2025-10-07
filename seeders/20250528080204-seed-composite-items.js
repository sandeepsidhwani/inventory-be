'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const units = ['dozen', 'box', 'grams', 'kilograms', 'meters', 'tablets', 'units'];
    const accounts = ['Contract Assets', 'merchandise', 'transportation expense', 'cost of good sold', 'job costing', 'labor', 'materials'];

    const items = users.flatMap((user, index) =>
      Array.from({ length: 10 }).map((_, i) => ({
        name: `Item ${index + 1}-${i + 1}`,
        sku: `SKU${index + 1}${i + 1}${Math.floor(Math.random() * 1000)}`,
        unit: units[Math.floor(Math.random() * units.length)],
        selling_price: (Math.random() * 100).toFixed(2),
        account: accounts[Math.floor(Math.random() * accounts.length)],
        description: `Description for Item ${index + 1}-${i + 1}`,
        cost_price: (Math.random() * 80).toFixed(2),
        preferred_vendor: `Vendor ${index + 1}`,
        weight: (Math.random() * 5).toFixed(2),
        manufacturer: `Manufacturer ${index + 1}`,
        brand: `Brand ${index + 1}`,
        upc: `UPC${index + 1}${i + 1}`,
        mpn: `MPN${index + 1}${i + 1}`,
        ean: `EAN${index + 1}${i + 1}`,
        isbn: `ISBN${index + 1}${i + 1}`,
        opening_stock_rate_per_unit: (Math.random() * 50).toFixed(2),
        opening_stock: Math.floor(Math.random() * 100),
        user_id: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    await queryInterface.bulkInsert('composite_items', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('composite_items', null, {});
  }
};
