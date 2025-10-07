'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch all users (assuming payments made are linked to users)
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const vendors = ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'];
    const modes = ['Cash', 'Bank Transfer', 'Cheque', 'Credit Card'];

    const paymentsMade = users.flatMap((user, userIndex) =>
      Array.from({ length: 10 }).map((_, i) => {
        const paymentDate = new Date();
        paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 60));

        const amount = parseFloat((Math.random() * 1000 + 100).toFixed(2));
        const unusedAmount = parseFloat((Math.random() * (amount / 2)).toFixed(2));

        return {
          date: paymentDate,
          payment: `PAY-${userIndex + 1}${i + 1000}`,
          reference: `REF-${userIndex + 1}${i + 2000}`,
          vendor_name: vendors[Math.floor(Math.random() * vendors.length)],
          bill: `BILL-${userIndex + 1}${i + 3000}`,
          mode: modes[Math.floor(Math.random() * modes.length)],
          amount: amount,
          unused_amount: unusedAmount,
          user_id: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await queryInterface.bulkInsert('payments_mades', paymentsMade, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payments_mades', null, {});
  }
};
