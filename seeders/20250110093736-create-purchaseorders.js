'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const purchaseOrders = [];
    users.forEach((user) => {
      for (let i = 1; i <= 10; i++) {
        purchaseOrders.push({
          vendor_name: `Vendor ${i} for User ${user.id}`,
          delivery_address: `Delivery Address ${i} for User ${user.id}`,
          purchase_order_number: `PO-${user.id}-${i}`,
          reference_number: `Ref-${i}`,
          date: new Date(),
          expected_delivery_date: new Date(),
          payment_terms: `Net ${30 + i}`,
          shipment_preference: `Preference ${i}`,
          item_name: `Item ${i}`,
          account: `Account ${i}`,
          quantity: Math.floor(Math.random() * 100) + 1,
          rate: Math.random() * 100,
          amount: Math.random() * 1000,
          discount: Math.random() * 50,
          discount_account: `Discount Account ${i}`,
          customer_notes: `Notes for PO ${i}`,
          terms_conditions: `Terms and Conditions for PO ${i}`,
          user_id: user.id,
        });
      }
    });

    await queryInterface.bulkInsert('purchase_orders', purchaseOrders);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('purchase_orders', null, {});
  },
};
