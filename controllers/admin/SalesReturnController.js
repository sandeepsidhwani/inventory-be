const { SalesReturn } = require("../../models");

const SalesReturnController = {
  // CREATE Sales Return
  createSalesReturn: async (req, res) => {
    try {
      const salesReturn = await SalesReturn.create({
        ...req.body,
        user_id: req.user.id,
      });
      res.status(201).json(salesReturn);
    } catch (err) {
      console.error("Error creating sales return:", err);
      res.status(500).json({ error: "Failed to create sales return" });
    }
  },

  // READ All Sales Returns (User-Specific)
  getAllSalesReturns: async (req, res) => {
    try {
      const returns = await SalesReturn.findAll({
        where: { user_id: req.user.id },
      });
      res.json(returns);
    } catch (err) {
      console.error("Error fetching sales returns:", err);
      res.status(500).json({ error: "Failed to fetch sales returns" });
    }
  },

  // READ Single Sales Return by ID
  getSalesReturnById: async (req, res) => {
    const { id } = req.params;
    try {
      const salesReturn = await SalesReturn.findOne({
        where: { id, user_id: req.user.id },
      });
      if (!salesReturn)
        return res.status(404).json({ error: "Sales return not found" });
      res.json(salesReturn);
    } catch (err) {
      console.error("Error fetching sales return:", err);
      res.status(500).json({ error: "Failed to fetch sales return" });
    }
  },

  // UPDATE Sales Return
  updateSalesReturn: async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await SalesReturn.update(
        { ...req.body },
        { where: { id, user_id: req.user.id } }
      );
      if (updated[0] === 0)
        return res
          .status(404)
          .json({ error: "Sales return not found or not authorized" });
      res.json({ message: "Sales return updated successfully" });
    } catch (err) {
      console.error("Error updating sales return:", err);
      res.status(500).json({ error: "Failed to update sales return" });
    }
  },

  // DELETE Sales Return
  deleteSalesReturn: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await SalesReturn.destroy({
        where: { id, user_id: req.user.id },
      });
      if (deleted === 0)
        return res
          .status(404)
          .json({ error: "Sales return not found or not authorized" });
      res.json({ message: "Sales return deleted successfully" });
    } catch (err) {
      console.error("Error deleting sales return:", err);
      res.status(500).json({ error: "Failed to delete sales return" });
    }
  },
};

module.exports = SalesReturnController;
