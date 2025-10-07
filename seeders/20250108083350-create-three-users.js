'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate 3 dummy users with hashed passwords
    const dummyUsers = [];
    for (let i = 1; i <= 3; i++) {
      const plainPassword = 'password'; // The plain password
      const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the password

      dummyUsers.push({
        name: `User ${i}`,
        username: `user${i}`,
        email: `user${i}@inventory.com`,
        password: hashedPassword, // Store hashed password
        mobileno: `10000000${i}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
      });
    }

    // Insert the users into the database
    await queryInterface.bulkInsert('users', dummyUsers, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove only the 3 dummy users
    await queryInterface.bulkDelete('users', {
      username: ['user1', 'user2', 'user3'],
    });
  },
};
