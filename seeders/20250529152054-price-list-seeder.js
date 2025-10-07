'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Example: fetch some related data if needed (e.g., users) — optional, remove if not needed
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const priceListTypes = ['Retail', 'Wholesale', 'Special Offer', 'Seasonal'];
    const transactionTypes = ['Sale', 'Purchase', 'Return', 'Exchange'];
    const pricingSchemes = ['Fixed', 'Tiered', 'Volume Discount', 'Bundle'];
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];

    // If you want to associate price lists with users, else just generate data directly
    const priceLists = users.flatMap((user, index) =>
      Array.from({ length: 10 }).map((_, i) => ({
        name: `Price List ${index + 1}-${i + 1}`,
        transaction_type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
        price_list_type: priceListTypes[Math.floor(Math.random() * priceListTypes.length)],
        description: `Description for Price List ${index + 1}-${i + 1}`,
        pricing_scheme: pricingSchemes[Math.floor(Math.random() * pricingSchemes.length)],
        currency_value: currencies[Math.floor(Math.random() * currencies.length)],
        discount: parseFloat((Math.random() * 30).toFixed(2)),   // discount as a decimal (0-30)
        percentage: parseFloat((Math.random() * 100).toFixed(2)), // percentage 0-100
        user_id: user.id,   // if you have user association; otherwise remove
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    await queryInterface.bulkInsert('price_lists', priceLists, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('price_lists', null, {});
  }
};
