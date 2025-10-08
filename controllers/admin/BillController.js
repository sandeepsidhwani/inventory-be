const { Bill } = require("../../models");
const sequelize = require("../../db");

const BillController = {
  // CREATE Bill (Protected)
  createBill: async (req, res) => {
    const {
      vendor_name,
      bill_no,
      order_no,
      bill_date,
      due_date,
      item_name,
      quantity,
      rate,
      discount,
      tds,
      total,
    } = req.body;

    try {
      // Input validation
      if (
        !vendor_name ||
        !bill_no ||
        !bill_date ||
        !due_date ||
        !item_name ||
        !quantity ||
        !rate
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create the bill
      const bill = await Bill.create(
        {
          vendor_name,
          bill_no,
          order_no,
          bill_date,
          due_date,
          item_name,
          quantity,
          rate,
          discount,
          tds,
          total,
          user_id: req.user.id,
        },
        {
          timestamps: false, // Disable timestamps explicitly for this query
        }
      );

      res.status(201).json(bill);
    } catch (err) {
      console.error("Error creating bill:", err);

      // Check for specific Sequelize errors
      if (err.name === "SequelizeValidationError") {
        return res
          .status(400)
          .json({ error: "Invalid data provided", details: err.errors });
      }

      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "Bill number must be unique" });
      }

      res.status(500).json({ error: "Failed to create bill" });
    }
  },

  // READ all Bills (User-Specific)
  getAllBills: async (req, res) => {
    try {
      const bills = await Bill.findAll({
        where: { user_id: req.user.id },
        attributes: [
          "id",
          "vendor_name",
          "bill_no",
          "order_no",
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("bill_date"), "%Y-%m-%d"),
            "bill_date",
          ],
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("due_date"), "%Y-%m-%d"),
            "due_date",
          ],
          "item_name",
          "quantity",
          "rate",
          "discount",
          "tds",
          "total",
        ],
      });
      res.json(bills);
    } catch (err) {
      console.error("Error fetching bills:", err);
      res.status(500).json({ error: "Failed to fetch bills" });
    }
  },

  // READ one Bill by ID (User-Specific)
  getBillById: async (req, res) => {
    const { id } = req.params;

    try {
      const bill = await Bill.findOne({
        where: { id, user_id: req.user.id },
        attributes: [
          "id",
          "vendor_name",
          "bill_no",
          "order_no",
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("bill_date"), "%Y-%m-%d"),
            "bill_date",
          ],
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("due_date"), "%Y-%m-%d"),
            "due_date",
          ],
          "item_name",
          "quantity",
          "rate",
          "discount",
          "tds",
          "total",
        ],
      });

      if (!bill) return res.status(404).json({ error: "Bill not found" });
      res.json(bill);
    } catch (err) {
      console.error("Error fetching bill:", err);
      res.status(500).json({ error: "Failed to fetch bill" });
    }
  },

  // UPDATE Bill (Protected)
  updateBill: async (req, res) => {
    const { id } = req.params;
    const {
      vendor_name,
      bill_no,
      order_no,
      bill_date,
      due_date,
      item_name,
      quantity,
      rate,
      discount,
      tds,
      total,
    } = req.body;

    try {
      const [updatedRows] = await Bill.update(
        {
          vendor_name,
          bill_no,
          order_no,
          bill_date,
          due_date,
          item_name,
          quantity,
          rate,
          discount,
          tds,
          total,
        },
        { where: { id, user_id: req.user.id } }
      );

      if (updatedRows === 0)
        return res
          .status(404)
          .json({ error: "Bill not found or not authorized" });
      res.json({ message: "Bill updated successfully" });
    } catch (err) {
      console.error("Error updating bill:", err);
      res.status(500).json({ error: "Failed to update bill" });
    }
  },

  // DELETE Bill (Protected)
  deleteBill: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedRows = await Bill.destroy({
        where: { id, user_id: req.user.id },
      });

      if (deletedRows === 0)
        return res
          .status(404)
          .json({ error: "Bill not found or not authorized" });
      res.json({ message: "Bill deleted successfully" });
    } catch (err) {
      console.error("Error deleting bill:", err);
      res.status(500).json({ error: "Failed to delete bill" });
    }
  },
};

module.exports = BillController;
