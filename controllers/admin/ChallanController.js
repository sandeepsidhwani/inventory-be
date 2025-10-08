const { Challan } = require('../../models');

const ChallanController = {
  // CREATE Challan (Protected)
  createChallan: async (req, res) => {
    const {
      customer_name,
      challan_number,
      challan_date,
      challan_type,
      item_name,
      quantity,
      rate,
      discount,
      total,
      customer_notes,
      terms_condition,
    } = req.body;

    try {
      const challan = await Challan.create(
        {
          customer_name,
          challan_number,
          challan_date,
          challan_type,
          item_name,
          quantity,
          rate,
          discount,
          total,
          customer_notes,
          terms_condition,
          user_id: req.user.id,
        },
        {
          timestamps: false, // Disable timestamps explicitly for this query
        }
      );

      res.status(201).json(challan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // READ all Challans (User-Specific)
  getAllChallans: async (req, res) => {
    try {
      const challans = await Challan.findAll({
        where: { user_id: req.user.id },
        attributes: [
          "id",
          "customer_name",
          "challan_number",
          "challan_date",
          "challan_type",
          "item_name",
          "quantity",
          "rate",
          "discount",
          "total",
          "customer_notes",
          "terms_condition",
        ],
      });

      res.json(challans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // READ one Challan by ID (User-Specific)
  getChallanById: async (req, res) => {
    const { id } = req.params;

    try {
      const challan = await Challan.findOne({
        where: { id, user_id: req.user.id },
        attributes: [
          "id",
          "customer_name",
          "challan_number",
          "challan_date",
          "challan_type",
          "item_name",
          "quantity",
          "rate",
          "discount",
          "total",
          "customer_notes",
          "terms_condition",
        ],
      });

      if (!challan) return res.status(404).json({ error: "Challan not found" });

      res.json(challan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // UPDATE Challan (Protected)
  updateChallan: async (req, res) => {
    const { id } = req.params;
    const {
      customer_name,
      challan_number,
      challan_date,
      challan_type,
      item_name,
      quantity,
      rate,
      discount,
      total,
      customer_notes,
      terms_condition,
    } = req.body;

    try {
      const challan = await Challan.findOne({
        where: { id, user_id: req.user.id },
      });

      if (!challan) return res.status(404).json({ error: "Challan not found" });

      await challan.update({
        customer_name,
        challan_number,
        challan_date,
        challan_type,
        item_name,
        quantity,
        rate,
        discount,
        total,
        customer_notes,
        terms_condition,
      });

      res.json({ message: "Challan updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE Challan (Protected)
  deleteChallan: async (req, res) => {
    const { id } = req.params;

    try {
      const rowsDeleted = await Challan.destroy({
        where: { id, user_id: req.user.id },
      });

      if (!rowsDeleted)
        return res.status(404).json({ message: "Challan not found" });

      res.json({ message: "Challan deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ChallanController;