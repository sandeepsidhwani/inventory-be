const { PurchaseReceive } = require("../../models");

const PurchaseReceiveController = {
  // CREATE Purchase Receive
  createPurchaseReceive: async (req, res) => {
    try {
      const purchase = await PurchaseReceive.create({
        ...req.body,
        user_id: req.user.id,
      });
      res.status(201).json(purchase);
    } catch (err) {
      console.error("Error creating purchase receive:", err);
      res.status(500).json({ error: "Failed to create purchase receive" });
    }
  },

  // READ all Purchase Receives (User-Specific)
  getAllPurchaseReceives: async (req, res) => {
    try {
      const purchases = await PurchaseReceive.findAll({
        where: { user_id: req.user.id },
        order: [["createdAt", "DESC"]],
      });
      res.json(purchases);
    } catch (err) {
      console.error("Error fetching purchase receives:", err);
      res.status(500).json({ error: "Failed to fetch purchase receives" });
    }
  },

  // READ one Purchase Receive by ID (User-Specific)
  getPurchaseReceiveById: async (req, res) => {
    const { id } = req.params;
    try {
      const purchase = await PurchaseReceive.findOne({
        where: { id, user_id: req.user.id },
      });
      if (!purchase)
        return res.status(404).json({ error: "Purchase receive not found" });
      res.json(purchase);
    } catch (err) {
      console.error("Error fetching purchase receive:", err);
      res.status(500).json({ error: "Failed to fetch purchase receive" });
    }
  },

  // UPDATE Purchase Receive (Protected)
  updatePurchaseReceive: async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await PurchaseReceive.update(
        { ...req.body },
        { where: { id, user_id: req.user.id } }
      );
      if (updated[0] === 0)
        return res
          .status(404)
          .json({ error: "Purchase receive not found or not authorized" });
      res.json({ message: "Purchase receive updated successfully" });
    } catch (err) {
      console.error("Error updating purchase receive:", err);
      res.status(500).json({ error: "Failed to update purchase receive" });
    }
  },

  // DELETE Purchase Receive (Protected)
  deletePurchaseReceive: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await PurchaseReceive.destroy({
        where: { id, user_id: req.user.id },
      });
      if (deleted === 0)
        return res
          .status(404)
          .json({ error: "Purchase receive not found or not authorized" });
      res.json({ message: "Purchase receive deleted successfully" });
    } catch (err) {
      console.error("Error deleting purchase receive:", err);
      res.status(500).json({ error: "Failed to delete purchase receive" });
    }
  },

  // GET Purchase Receives by Status (User-Specific)
  getPurchaseReceivesByStatus: async (req, res) => {
    const { status } = req.params;
    try {
      const purchases = await PurchaseReceive.findAll({
        where: {
          status: status,
          user_id: req.user.id,
        },
        order: [["receive_date", "DESC"]],
      });
      res.json(purchases);
    } catch (err) {
      console.error("Error fetching purchase receives by status:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch purchase receives by status" });
    }
  },

  // GET Purchase Receives by Vendor (User-Specific)
  getPurchaseReceivesByVendor: async (req, res) => {
    const { vendorId } = req.params;
    try {
      const purchases = await PurchaseReceive.findAll({
        where: {
          vendor_id: vendorId,
          user_id: req.user.id,
        },
        order: [["receive_date", "DESC"]],
      });
      res.json(purchases);
    } catch (err) {
      console.error("Error fetching purchase receives by vendor:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch purchase receives by vendor" });
    }
  },

  // GET Purchase Receives by Purchase Order (User-Specific)
  getPurchaseReceivesByPurchaseOrder: async (req, res) => {
    const { purchaseOrderId } = req.params;
    try {
      const purchases = await PurchaseReceive.findAll({
        where: {
          purchase_order_id: purchaseOrderId,
          user_id: req.user.id,
        },
        order: [["receive_date", "DESC"]],
      });
      res.json(purchases);
    } catch (err) {
      console.error("Error fetching purchase receives by purchase order:", err);
      res
        .status(500)
        .json({ error: "Failed to fetch purchase receives by purchase order" });
    }
  },
};

module.exports = PurchaseReceiveController;
