// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'localhost', // Your MySQL host
//   user: 'root',      // Your MySQL username
//   password: 'admin',  // Your MySQL password
//   database: 'inventory_management'   // Your MySQL database name
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err.stack);
//     return;
//   }
//   console.log('Connected to MySQL as id ' + connection.threadId);
// });

// module.exports = connection;

const { Sequelize } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize('inventory_management', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Connection to MySQL has been established successfully.'))
  .catch((err) => console.error('Unable to connect to MySQL:', err));

module.exports = sequelize;

