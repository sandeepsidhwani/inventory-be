const { Invoice } = require("../../models");

const InvoiceController = {
  // CREATE new invoice
  createInvoice: async (req, res) => {
    try {
      const newInvoice = await Invoice.create({
        ...req.body,
        user_id: req.user.id,
      });
      res.json(newInvoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // READ all invoices (User-Specific)
  getAllInvoices: async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        where: { user_id: req.user.id },
      });
      res.json(invoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // READ one invoice by ID (User-Specific)
  getInvoiceById: async (req, res) => {
    try {
      const invoice = await Invoice.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!invoice)
        return res.status(404).json({ message: "Invoice not found" });
      res.json(invoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // UPDATE invoice
  updateInvoice: async (req, res) => {
    try {
      // Check if the invoice exists
      const invoice = await Invoice.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });

      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      // Update the invoice
      await invoice.update(req.body);

      res.json({ message: "Invoice updated successfully", invoice });
    } catch (err) {
      console.error("Error updating invoice:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE invoice
  deleteInvoice: async (req, res) => {
    try {
      const deleted = await Invoice.destroy({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!deleted)
        return res.status(404).json({ message: "Invoice not found" });
      res.json({ message: "Invoice deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = InvoiceController;
