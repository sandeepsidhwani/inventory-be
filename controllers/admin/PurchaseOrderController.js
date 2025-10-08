const { PurchaseOrder } = require("../../models");

const PurchaseOrderController = {
  // Create a new purchase order
  createPurchaseOrder: async (req, res) => {
    try {
      const purchaseOrder = await PurchaseOrder.create(
        {
          vendor_name: req.body.vendor_name,
          delivery_address: req.body.delivery_address,
          purchase_order_number: req.body.purchase_order_number,
          reference_number: req.body.reference_number,
          date: req.body.date,
          expected_delivery_date: req.body.expected_delivery_date,
          payment_terms: req.body.payment_terms,
          shipment_preference: req.body.shipment_preference,
          item_name: req.body.item_name,
          account: req.body.account,
          quantity: req.body.quantity,
          rate: req.body.rate,
          amount: req.body.amount,
          discount: req.body.discount,
          discount_account: req.body.discount_account,
          customer_notes: req.body.customer_notes,
          terms_conditions: req.body.terms_conditions,
          user_id: req.user.id,
        },
        {
          timestamps: false,
        }
      );

      res.status(201).json(purchaseOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all purchase orders for the logged-in user
  getAllPurchaseOrders: async (req, res) => {
    try {
      const purchaseOrders = await PurchaseOrder.findAll({
        where: { user_id: req.user.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.json(purchaseOrders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific purchase order by ID for the logged-in user
  getPurchaseOrderById: async (req, res) => {
    try {
      const purchaseOrder = await PurchaseOrder.findOne({
        where: { id: req.params.id, user_id: req.user.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (!purchaseOrder) {
        return res.status(404).json({ message: "Purchase order not found" });
      }

      res.json(purchaseOrder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a purchase order by ID for the logged-in user
  updatePurchaseOrder: async (req, res) => {
    try {
      const [updated] = await PurchaseOrder.update(req.body, {
        where: { id: req.params.id, user_id: req.user.id },
        fields: [
          "vendor_name",
          "delivery_address",
          "purchase_order_number",
          "reference_number",
          "date",
          "expected_delivery_date",
          "payment_terms",
          "shipment_preference",
          "item_name",
          "account",
          "quantity",
          "rate",
          "amount",
          "discount",
          "discount_account",
          "customer_notes",
          "terms_conditions",
          "user_id",
        ],
      });

      if (!updated) {
        return res.status(404).json({ message: "Purchase order not found" });
      }

      res.json({ message: "Purchase order updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a purchase order by ID for the logged-in user
  deletePurchaseOrder: async (req, res) => {
    try {
      const deleted = await PurchaseOrder.destroy({
        where: { id: req.params.id, user_id: req.user.id },
      });
      if (!deleted)
        return res
          .status(404)
          .json({ message: "Purchase order not found or not authorized" });
      res.json({ message: "Purchase order deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = PurchaseOrderController;
