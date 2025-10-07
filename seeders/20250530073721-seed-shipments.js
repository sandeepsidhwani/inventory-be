'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch users if shipments are linked to users (optional)
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const carriers = ['FedEx', 'UPS', 'DHL', 'USPS', 'BlueDart'];
    const packageTypes = ['Box', 'Envelope', 'Crate', 'Tube'];
    const statuses = ['pending', 'shipped', 'delivered', 'cancelled'];

    const generateTracking = () => Math.random().toString().slice(2, 12);
    const generateTrackingURL = (carrier, tracking) =>
      `https://${carrier.toLowerCase()}.com/track/${tracking}`;

    // Generate shipment records per user
    const shipments = users.flatMap((user, index) =>
      Array.from({ length: 10 }).map((_, i) => {
        const carrier = carriers[Math.floor(Math.random() * carriers.length)];
        const tracking = generateTracking();
        const shipDate = new Date();
        shipDate.setDate(shipDate.getDate() - Math.floor(Math.random() * 10));

        return {
          customer_name: `Customer ${index + 1}-${i + 1}`,
          sales_order: `SO-${index + 1}${i + 1000}`,
          package: packageTypes[Math.floor(Math.random() * packageTypes.length)],
          shipment_order: `SHIP-${index + 1}${i + 2000}`,
          ship_date: shipDate,
          carrier: carrier,
          tracking: tracking,
          tracking_url: generateTrackingURL(carrier, tracking),
          shipping_charges: parseFloat((Math.random() * 100).toFixed(2)),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          user_id: user.id, // Optional: remove if your table doesn't have user_id
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await queryInterface.bulkInsert('shipments', shipments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shipments', null, {});
  }
};
