const { RetainerInvoice } = require("../../models");

const RetainerInvoiceController = {
  // Create a new retainer invoice (Protected)
  createRetainerInvoice: async (req, res) => {
    try {
      const {
        customer_name,
        retainer_invoice_number,
        reference_number,
        retainer_invoice_date,
        description,
        amount,
        customer_notes,
        terms_conditions,
        email_communications,
      } = req.body;

      const newInvoice = await RetainerInvoice.create({
        customer_name,
        retainer_invoice_number,
        reference_number,
        retainer_invoice_date,
        description,
        amount,
        customer_notes,
        terms_conditions,
        email_communications,
        user_id: req.user.id,
      });

      res.status(201).json(newInvoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get all retainer invoices (User-Specific)
  getAllRetainerInvoices: async (req, res) => {
    try {
      const invoices = await RetainerInvoice.findAll({
        where: { user_id: req.user.id },
      });
      res.json(invoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get a specific retainer invoice by ID (User-Specific)
  getRetainerInvoiceById: async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await RetainerInvoice.findOne({
        where: { id, user_id: req.user.id },
      });

      if (!invoice) {
        return res.status(404).json({ message: "Retainer invoice not found" });
      }

      res.json(invoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update a specific retainer invoice by ID (Protected)
  updateRetainerInvoice: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const {
        customer_name,
        retainer_invoice_number,
        reference_number,
        retainer_invoice_date,
        description,
        amount,
        customer_notes,
        terms_conditions,
        email_communications,
      } = req.body;

      console.log("Retainer Invoice ID:", id);
      console.log("User ID:", userId);
      console.log("Request Body:", req.body);

      // Validate input fields
      if (!id || !userId) {
        return res.status(400).json({ message: "Invalid request parameters" });
      }

      // Update the retainer invoice - FIXED: Changed user.id to userId
      const [updatedRows] = await RetainerInvoice.update(
        {
          customer_name,
          retainer_invoice_number,
          reference_number,
          retainer_invoice_date,
          description,
          amount,
          customer_notes,
          terms_conditions,
          email_communications,
        },
        {
          where: { id, user_id: userId }, // Fixed: changed user.id to userId
        }
      );

      if (updatedRows === 0) {
        return res
          .status(404)
          .json({ message: "Retainer invoice not found or not authorized" });
      }

      res.json({ message: "Retainer invoice updated successfully" });
    } catch (err) {
      console.error("Error updating retainer invoice:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // Delete a specific retainer invoice by ID (Protected)
  deleteRetainerInvoice: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedRows = await RetainerInvoice.destroy({
        where: { id, user_id: req.user.id },
      });

      if (deletedRows === 0) {
        return res
          .status(404)
          .json({ message: "Retainer invoice not found or not authorized" });
      }

      res.json({ message: "Retainer invoice deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = RetainerInvoiceController;
