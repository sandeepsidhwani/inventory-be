'use strict';

const { sequelize } = require('../db'); // Import Sequelize instance
const { User } = require('../models'); // Import the User model

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the IDs of all existing users
    const users = await User.findAll({ attributes: ['id'] }); // Ensure User model is correctly imported
    const userIds = users.map((user) => user.id);

    // Generate 10 dummy customers for each user
    const dummyCustomers = [];
    userIds.forEach((userId, userIndex) => {
      for (let i = 1; i <= 10; i++) {
        dummyCustomers.push({
          customer_type: 'Business',
          company_name: `Company ${userIndex}_${i}`,
          display_name: `Customer ${userIndex}_${i}`,
          email: `customer${userIndex}_${i}@example.com`, // Unique email
          phone: `10000000${userIndex}${i}`, // Unique phone
          currency: 'USD',
          payment_terms: 'Net 30',
          address: `Address ${userIndex}_${i}`,
          user_id: userId, // Associate with the user
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });
    

    // Insert the customers into the database
    await queryInterface.bulkInsert('customers', dummyCustomers, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove all dummy customers
    await queryInterface.bulkDelete('customers', null, {});
  },
};
