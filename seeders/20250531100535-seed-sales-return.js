'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch all users (assuming sales returns are linked to users)
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const statuses = ['Pending', 'Approved', 'Rejected'];
    const customers = ['John Doe', 'Jane Smith', 'Acme Corp', 'Globex Ltd'];

    const salesReturns = users.flatMap((user, userIndex) =>
      Array.from({ length: 10 }).map((_, i) => {
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() - Math.floor(Math.random() * 60));

        return {
          date: returnDate,
          rma: `RMA-${userIndex + 1}${i + 1000}`,
          sales_order: `SO-${userIndex + 1}${i + 2000}`,
          customer_name: customers[Math.floor(Math.random() * customers.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          user_id: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await queryInterface.bulkInsert('sales_returns', salesReturns, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sales_returns', null, {});
  }
};
