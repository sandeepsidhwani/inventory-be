const { CreditNote } = require("../../models");

const CreditNoteController = {
  // Create a new credit note
  createCreditNote: async (req, res) => {
    try {
      const {
        customer_name,
        credit_note_number,
        reference_number,
        credit_note_date,
        salesperson,
        item_name,
        account,
        quantity,
        rate,
        discount,
        amount,
        customer_notes,
        terms_conditions,
      } = req.body;

      const newCreditNote = await CreditNote.create({
        customer_name,
        credit_note_number,
        reference_number,
        credit_note_date,
        salesperson,
        item_name,
        account,
        quantity,
        rate,
        discount,
        amount,
        customer_notes,
        terms_conditions,
        user_id: req.user.id,
      });

      res.status(201).json(newCreditNote);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all credit notes for the logged-in user
  getAllCreditNotes: async (req, res) => {
    try {
      const creditNotes = await CreditNote.findAll({
        where: { user_id: req.user.id },
      });
      res.json(creditNotes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific credit note by ID for the logged-in user
  getCreditNoteById: async (req, res) => {
    try {
      const creditNote = await CreditNote.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });

      if (!creditNote) {
        return res.status(404).json({ message: "Credit note not found" });
      }

      res.json(creditNote);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a specific credit note by ID for the logged-in user
  updateCreditNote: async (req, res) => {
    try {
      const {
        customer_name,
        credit_note_number,
        reference_number,
        credit_note_date,
        salesperson,
        item_name,
        account,
        quantity,
        rate,
        discount,
        amount,
        customer_notes,
        terms_conditions,
      } = req.body;

      const [updated] = await CreditNote.update(
        {
          customer_name,
          credit_note_number,
          reference_number,
          credit_note_date,
          salesperson,
          item_name,
          account,
          quantity,
          rate,
          discount,
          amount,
          customer_notes,
          terms_conditions,
        },
        {
          where: {
            id: req.params.id,
            user_id: req.user.id,
          },
        }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ message: "Credit note not found or not authorized" });
      }

      res.json({ message: "Credit note updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a specific credit note by ID for the logged-in user
  deleteCreditNote: async (req, res) => {
    try {
      const deleted = await CreditNote.destroy({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });

      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Credit note not found or not authorized" });
      }

      res.json({ message: "Credit note deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = CreditNoteController;
