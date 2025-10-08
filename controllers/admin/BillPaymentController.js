const { BillPayment } = require("../../models");

const BillPaymentController = {
  // Add a new bill payment
  createBillPayment: async (req, res) => {
    try {
      const billPayment = await BillPayment.create({
        ...req.body,
        user_id: req.user.id,
      });
      res.status(201).json(billPayment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all bill payments for the logged-in user
  getAllBillPayments: async (req, res) => {
    try {
      const billPayments = await BillPayment.findAll({
        where: { user_id: req.user.id },
      });
      res.json(billPayments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific bill payment by ID for the logged-in user
  getBillPaymentById: async (req, res) => {
    try {
      const billPayment = await BillPayment.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });

      if (!billPayment)
        return res.status(404).json({ message: "Bill payment not found" });
      res.json(billPayment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a bill payment by ID for the logged-in user
  updateBillPayment: async (req, res) => {
    try {
      const updated = await BillPayment.update(req.body, {
        where: { id: req.params.id, user_id: req.user.id },
      });

      if (!updated[0])
        return res
          .status(404)
          .json({ message: "Bill payment not found or not authorized" });
      res.json({ message: "Bill payment updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a bill payment by ID for the logged-in user
  deleteBillPayment: async (req, res) => {
    try {
      const deleted = await BillPayment.destroy({
        where: { id: req.params.id, user_id: req.user.id },
      });

      if (!deleted)
        return res.status(404).json({ message: "Bill payment not found" });
      res.json({ message: "Bill payment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = BillPaymentController;
