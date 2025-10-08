const { Shipment } = require("../../models");

const ShipmentController = {
  createShipment: async (req, res) => {
    const {
      customer_name,
      sales_order,
      package: packageType,
      shipment_order,
      ship_date,
      carrier,
      tracking,
      tracking_url,
      shipping_charges,
      status,
    } = req.body;

    try {
      const shipment = await Shipment.create({
        customer_name,
        sales_order,
        package: packageType,
        shipment_order,
        ship_date,
        carrier,
        tracking,
        tracking_url,
        shipping_charges,
        status,
        user_id: req.user.id,
      });
      res.status(201).json(shipment);
    } catch (err) {
      console.error("Error creating shipment:", err);
      res.status(500).json({ error: "Failed to create shipment" });
    }
  },

  getAllShipments: async (req, res) => {
    try {
      const shipments = await Shipment.findAll({
        where: { user_id: req.user.id },
        order: [["createdAt", "DESC"]],
      });
      res.json(shipments);
    } catch (err) {
      console.error("Error fetching shipments:", err);
      res.status(500).json({ error: "Failed to fetch shipments" });
    }
  },

  getShipmentById: async (req, res) => {
    const { id } = req.params;
    try {
      const shipment = await Shipment.findOne({
        where: { id, user_id: req.user.id },
      });
      if (!shipment)
        return res.status(404).json({ error: "Shipment not found" });
      res.json(shipment);
    } catch (err) {
      console.error("Error fetching shipment:", err);
      res.status(500).json({ error: "Failed to fetch shipment" });
    }
  },

  updateShipment: async (req, res) => {
    const { id } = req.params;
    const {
      customer_name,
      sales_order,
      package: packageType,
      shipment_order,
      ship_date,
      carrier,
      tracking,
      tracking_url,
      shipping_charges,
      status,
    } = req.body;

    try {
      const updatedRows = await Shipment.update(
        {
          customer_name,
          sales_order,
          package: packageType,
          shipment_order,
          ship_date,
          carrier,
          tracking,
          tracking_url,
          shipping_charges,
          status,
        },
        { where: { id, user_id: req.user.id } }
      );

      if (updatedRows[0] === 0)
        return res
          .status(404)
          .json({ error: "Shipment not found or not authorized" });

      res.json({ message: "Shipment updated successfully" });
    } catch (err) {
      console.error("Error updating shipment:", err);
      res.status(500).json({ error: "Failed to update shipment" });
    }
  },

  deleteShipment: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedRows = await Shipment.destroy({
        where: { id, user_id: req.user.id },
      });

      if (deletedRows === 0)
        return res
          .status(404)
          .json({ error: "Shipment not found or not authorized" });

      res.json({ message: "Shipment deleted successfully" });
    } catch (err) {
      console.error("Error deleting shipment:", err);
      res.status(500).json({ error: "Failed to delete shipment" });
    }
  },
};

module.exports = ShipmentController;
