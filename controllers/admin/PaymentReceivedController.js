const { PaymentReceived } = require("../../models");

const PaymentReceivedController = {
  // CREATE Payment Received
  createPaymentReceived: async (req, res) => {
    try {
      const payment = await PaymentReceived.create({
        ...req.body,
        user_id: req.user.id,
      });
      res.status(201).json(payment);
    } catch (err) {
      console.error("Error creating payment record:", err);
      res.status(500).json({ error: "Failed to create payment record" });
    }
  },

  // READ all Payments Received (User-Specific)
  getAllPaymentsReceived: async (req, res) => {
    try {
      const payments = await PaymentReceived.findAll({
        where: { user_id: req.user.id },
        order: [["createdAt", "DESC"]],
      });
      res.json(payments);
    } catch (err) {
      console.error("Error fetching payments:", err);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  },

  // READ one Payment Received by ID (User-Specific)
  getPaymentReceivedById: async (req, res) => {
    const { id } = req.params;
    try {
      const payment = await PaymentReceived.findOne({
        where: { id, user_id: req.user.id },
      });
      if (!payment) return res.status(404).json({ error: "Payment not found" });
      res.json(payment);
    } catch (err) {
      console.error("Error fetching payment:", err);
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  },

  // UPDATE Payment Received (Protected)
  updatePaymentReceived: async (req, res) => {
    const { id } = req.params;

    try {
      const updated = await PaymentReceived.update(
        { ...req.body },
        { where: { id, user_id: req.user.id } }
      );
      if (updated[0] === 0)
        return res
          .status(404)
          .json({ error: "Payment not found or not authorized" });
      res.json({ message: "Payment updated successfully" });
    } catch (err) {
      console.error("Error updating payment:", err);
      res.status(500).json({ error: "Failed to update payment" });
    }
  },

  // DELETE Payment Received (Protected)
  deletePaymentReceived: async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await PaymentReceived.destroy({
        where: { id, user_id: req.user.id },
      });
      if (deleted === 0)
        return res
          .status(404)
          .json({ error: "Payment not found or not authorized" });
      res.json({ message: "Payment deleted successfully" });
    } catch (err) {
      console.error("Error deleting payment:", err);
      res.status(500).json({ error: "Failed to delete payment" });
    }
  },

  // GET Payments by Status (User-Specific)
  getPaymentsByStatus: async (req, res) => {
    const { status } = req.params;
    try {
      const payments = await PaymentReceived.findAll({
        where: {
          status: status,
          user_id: req.user.id,
        },
        order: [["payment_date", "DESC"]],
      });
      res.json(payments);
    } catch (err) {
      console.error("Error fetching payments by status:", err);
      res.status(500).json({ error: "Failed to fetch payments by status" });
    }
  },

  // GET Payments by Customer (User-Specific)
  getPaymentsByCustomer: async (req, res) => {
    const { customerId } = req.params;
    try {
      const payments = await PaymentReceived.findAll({
        where: {
          customer_id: customerId,
          user_id: req.user.id,
        },
        order: [["payment_date", "DESC"]],
      });
      res.json(payments);
    } catch (err) {
      console.error("Error fetching payments by customer:", err);
      res.status(500).json({ error: "Failed to fetch payments by customer" });
    }
  },
};

module.exports = PaymentReceivedController;
