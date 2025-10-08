const { PaymentsMade } = require("../../models");

const PaymentsMadeController = {
  // CREATE a new payment made
  createPaymentMade: async (req, res) => {
    try {
      const payment = await PaymentsMade.create({
        ...req.body,
        user_id: req.user.id,
      });
      res.status(201).json(payment);
    } catch (err) {
      console.error("Error creating payment made:", err);
      res.status(500).json({ error: "Failed to create payment made" });
    }
  },

  // READ all payments made by user
  getAllPaymentsMade: async (req, res) => {
    try {
      const payments = await PaymentsMade.findAll({
        where: { user_id: req.user.id },
      });
      res.json(payments);
    } catch (err) {
      console.error("Error fetching payments made:", err);
      res.status(500).json({ error: "Failed to fetch payments made" });
    }
  },

  // READ single payment made by ID
  getPaymentMadeById: async (req, res) => {
    const { id } = req.params;
    try {
      const payment = await PaymentsMade.findOne({
        where: { id, user_id: req.user.id },
      });
      if (!payment)
        return res.status(404).json({ error: "Payment made not found" });
      res.json(payment);
    } catch (err) {
      console.error("Error fetching payment made:", err);
      res.status(500).json({ error: "Failed to fetch payment made" });
    }
  },

  // UPDATE payment made by ID
  updatePaymentMade: async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await PaymentsMade.update(
        { ...req.body },
        { where: { id, user_id: req.user.id } }
      );
      if (updated[0] === 0)
        return res
          .status(404)
          .json({ error: "Payment made not found or not authorized" });
      res.json({ message: "Payment made updated successfully" });
    } catch (err) {
      console.error("Error updating payment made:", err);
      res.status(500).json({ error: "Failed to update payment made" });
    }
  },

  // DELETE payment made
  deletePaymentMade: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await PaymentsMade.destroy({
        where: { id, user_id: req.user.id },
      });
      if (deleted === 0)
        return res
          .status(404)
          .json({ error: "Payment made not found or not authorized" });
      res.json({ message: "Payment made deleted successfully" });
    } catch (err) {
      console.error("Error deleting payment made:", err);
      res.status(500).json({ error: "Failed to delete payment made" });
    }
  },
};

module.exports = PaymentsMadeController;
