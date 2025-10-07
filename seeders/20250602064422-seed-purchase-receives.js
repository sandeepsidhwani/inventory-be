'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch all users (assuming purchase receives are linked to users)
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const statuses = ['pending', 'received', 'cancelled'];
    const vendors = ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'];

    const purchaseReceives = users.flatMap((user, userIndex) =>
      Array.from({ length: 10 }).map((_, i) => {
        const receiveDate = new Date();
        receiveDate.setDate(receiveDate.getDate() - Math.floor(Math.random() * 60));

        return {
          date: receiveDate,
          purchase_receive: `PR-${userIndex + 1}${i + 1000}`,
          purchase_order: `PO-${userIndex + 1}${i + 2000}`,
          vendor_name: vendors[Math.floor(Math.random() * vendors.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          quantity: Math.floor(Math.random() * 100) + 1,
          user_id: user.id, // optional: only if your schema includes user_id
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await queryInterface.bulkInsert('purchase_receives', purchaseReceives, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('purchase_receives', null, {});
  }
};
