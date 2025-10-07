'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch all users from the users table
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Generate 10 sales orders for each user
    const salesOrders = users.flatMap((user, userIndex) =>
      Array.from({ length: 10 }).map((_, i) => ({
        customer_name: `Customer ${userIndex + 1}-${i + 1}`,
        sales_order_number: `SO-${userIndex + 1}-${i + 1}`,
        reference_number: `REF-${userIndex + 1}-${i + 1}`,
        sales_order_date: new Date(),
        expected_shipment_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week later
        payment_terms: 'Net 30',
        delivery_method: Math.random() > 0.5 ? 'Courier' : 'Pickup',
        salesperson: `Salesperson ${userIndex + 1}`,
        item_name: `Product ${i + 1}`,
        quantity: Math.floor(Math.random() * 100) + 1, // Random quantity between 1 and 100
        rate: parseFloat((Math.random() * 500).toFixed(2)), // Random rate between 0 and 500
        discount: parseFloat((Math.random() * 50).toFixed(2)), // Random discount between 0 and 50
        amount: parseFloat(((Math.random() * 1000) + 100).toFixed(2)), // Random amount between 100 and 1100
        customer_notes: `Customer notes ${userIndex + 1}-${i + 1}`,
        terms_conditions: `Standard terms for SalesOrder ${userIndex + 1}-${i + 1}`,
        user_id: user.id,
      }))
    );

    // Insert generated sales orders into the SalesOrders table
    await queryInterface.bulkInsert('sales_orders', salesOrders, {});
  },

  async down(queryInterface, Sequelize) {
    // Delete all sales orders
    await queryInterface.bulkDelete('sales_orders', null, {});
  },
};
