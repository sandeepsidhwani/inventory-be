'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch users if payments are linked to users (optional)
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const paymentModes = ['Cash', 'Cheque', 'Bank Transfer', 'Credit Card', 'UPI'];
    const depositAccounts = ['Bank of America', 'Chase', 'HDFC', 'ICICI'];
    
    // Generate payment records per user
    const payments = users.flatMap((user, index) =>
      Array.from({ length: 10 }).map((_, i) => {
        const amount = parseFloat((Math.random() * 5000 + 100).toFixed(2));
        const bankCharge = parseFloat((Math.random() * 50).toFixed(2));
        const taxDeducted = parseFloat((amount * 0.05).toFixed(2)); // 5% TDS

        const paymentDate = new Date();
        paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 30));

        return {
          customer_name: `Customer ${index + 1}-${i + 1}`,
          amount_received: amount,
          bank_charge: bankCharge,
          payment_date: paymentDate,
          payment: `PAY-${index + 1}${i + 5000}`,
          payment_mode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
          deposit_to: depositAccounts[Math.floor(Math.random() * depositAccounts.length)],
          reference: `REF-${index + 1}${i + 9000}`,
          tax_deducted: taxDeducted,
          user_id: user.id, // Optional: remove if not needed
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await queryInterface.bulkInsert('payment_receiveds', payments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_receiveds', null, {});
  }
};
