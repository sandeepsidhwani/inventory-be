const { VendorAdvance } = require("../../models");

const VendorAdvanceController = {
  // Add a new vendor advance payment
  createVendorAdvance: async (req, res) => {
    try {
      const vendorAdvance = await VendorAdvance.create({
        ...req.body,
        user_id: req.user.id,
      });
      res.status(201).json(vendorAdvance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get all vendor advance payments for the logged-in user
  getAllVendorAdvances: async (req, res) => {
    try {
      const vendorAdvances = await VendorAdvance.findAll({
        where: { user_id: req.user.id },
      });
      res.json(vendorAdvances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get a specific vendor advance payment by ID for the logged-in user
  getVendorAdvanceById: async (req, res) => {
    try {
      const vendorAdvance = await VendorAdvance.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!vendorAdvance) {
        return res.status(404).json({ message: "Vendor advance not found" });
      }
      res.json(vendorAdvance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update a vendor advance payment by ID for the logged-in user
  updateVendorAdvance: async (req, res) => {
    try {
      const [updated] = await VendorAdvance.update(req.body, {
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!updated) {
        return res
          .status(404)
          .json({ message: "Vendor advance not found or not authorized" });
      }
      res.json({ message: "Vendor advance updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete a vendor advance payment by ID for the logged-in user
  deleteVendorAdvance: async (req, res) => {
    try {
      const deleted = await VendorAdvance.destroy({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!deleted) {
        return res.status(404).json({ message: "Vendor advance not found" });
      }
      res.json({ message: "Vendor advance deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = VendorAdvanceController;
