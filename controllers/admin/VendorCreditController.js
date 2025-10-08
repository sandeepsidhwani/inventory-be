const { VendorCredit } = require("../../models");

const VendorCreditController = {
  // Add a new vendor credit note
  createVendorCredit: async (req, res) => {
    try {
      const vendorCredit = await VendorCredit.create({
        ...req.body,
        user_id: req.user.id,
      });
      res.status(201).json(vendorCredit);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get all vendor credit notes for the logged-in user
  getAllVendorCredits: async (req, res) => {
    try {
      const vendorCredits = await VendorCredit.findAll({
        where: { user_id: req.user.id },
      });
      res.json(vendorCredits);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get a specific vendor credit note by ID for the logged-in user
  getVendorCreditById: async (req, res) => {
    try {
      const vendorCredit = await VendorCredit.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!vendorCredit) {
        return res
          .status(404)
          .json({ message: "Vendor credit note not found" });
      }
      res.json(vendorCredit);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update a vendor credit note by ID for the logged-in user
  updateVendorCredit: async (req, res) => {
    try {
      const [updated] = await VendorCredit.update(req.body, {
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!updated) {
        return res
          .status(404)
          .json({ message: "Vendor credit note not found or not authorized" });
      }
      res.json({ message: "Vendor credit note updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete a vendor credit note by ID for the logged-in user
  deleteVendorCredit: async (req, res) => {
    try {
      const deleted = await VendorCredit.destroy({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Vendor credit note not found" });
      }
      res.json({ message: "Vendor credit note deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = VendorCreditController;
