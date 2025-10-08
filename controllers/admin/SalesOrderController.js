const { SalesOrder } = require("../../models");

const SalesOrderController = {
  // Create a new sales order
  createSalesOrder: async (req, res) => {
    try {
      const {
        customer_name,
        sales_order_number,
        reference_number,
        sales_order_date,
        expected_shipment_date,
        payment_terms,
        delivery_method,
        salesperson,
        item_name,
        quantity,
        rate,
        discount,
        amount,
        customer_notes,
        terms_conditions,
      } = req.body;

      const newSalesOrder = await SalesOrder.create(
        {
          customer_name,
          sales_order_number,
          reference_number,
          sales_order_date,
          expected_shipment_date,
          payment_terms,
          delivery_method,
          salesperson,
          item_name,
          quantity,
          rate,
          discount,
          amount,
          customer_notes,
          terms_conditions,
          user_id: req.user.id,
        },
        {
          timestamps: false,
        }
      );

      res.status(201).json(newSalesOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get all sales orders for the logged-in user
  getAllSalesOrders: async (req, res) => {
    try {
      const salesOrders = await SalesOrder.findAll({
        where: { user_id: req.user.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.json(salesOrders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get a specific sales order by ID for the logged-in user
  getSalesOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const salesOrder = await SalesOrder.findOne({
        where: { id, user_id: req.user.id },
      });

      if (!salesOrder) {
        return res.status(404).json({ message: "Sales order not found" });
      }

      res.json(salesOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update a specific sales order by ID for the logged-in user
  updateSalesOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        customer_name,
        sales_order_number,
        reference_number,
        sales_order_date,
        expected_shipment_date,
        payment_terms,
        delivery_method,
        salesperson,
        item_name,
        quantity,
        rate,
        discount,
        amount,
        customer_notes,
        terms_conditions,
      } = req.body;

      const [updatedRows] = await SalesOrder.update(
        {
          customer_name,
          sales_order_number,
          reference_number,
          sales_order_date,
          expected_shipment_date,
          payment_terms,
          delivery_method,
          salesperson,
          item_name,
          quantity,
          rate,
          discount,
          amount,
          customer_notes,
          terms_conditions,
        },
        { where: { id, user_id: req.user.id } }
      );

      if (updatedRows === 0) {
        return res
          .status(404)
          .json({ message: "Sales order not found or not authorized" });
      }

      res.json({ message: "Sales order updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Delete a specific sales order by ID for the logged-in user
  deleteSalesOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedRows = await SalesOrder.destroy({
        where: { id, user_id: req.user.id },
      });

      if (deletedRows === 0) {
        return res
          .status(404)
          .json({ message: "Sales order not found or not authorized" });
      }

      res.json({ message: "Sales order deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = SalesOrderController;
