const { Adjustment } = require("../../models");

const AdjustmentController = {
  // CREATE new adjustment (Protected)
  createAdjustment: async (req, res) => {
    try {
      const {
        mode,
        reference_number,
        date,
        account,
        reason,
        description,
        item_name,
        quantity_available,
        new_quantity_on_hand,
        quantity_adjusted,
      } = req.body;

      const adjustment = await Adjustment.create(
        {
          mode,
          reference_number,
          date,
          account,
          reason,
          description,
          item_name,
          quantity_available,
          new_quantity_on_hand,
          quantity_adjusted,
          user_id: req.user.id,
        },
        {
          timestamps: false, // Disable timestamps explicitly for this query
        }
      );

      res.status(201).json(adjustment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // READ all adjustments (User-Specific)
  getAllAdjustments: async (req, res) => {
    try {
      const adjustments = await Adjustment.findAll({
        where: { user_id: req.user.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.json(adjustments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // READ one adjustment by ID (User-Specific)
  getAdjustmentById: async (req, res) => {
    try {
      const adjustment = await Adjustment.findOne({
        where: { id: req.params.id, user_id: req.user.id },
      });

      if (!adjustment)
        return res.status(404).json({ message: "Adjustment not found" });

      res.json(adjustment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // UPDATE adjustment (Protected)
  updateAdjustment: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Adjustment.update(req.body, {
        where: { id, user_id: req.user.id },
      });

      if (!updated[0])
        return res.status(404).json({ message: "Adjustment not found" });

      res.json({ message: "Adjustment updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE adjustment (Protected)
  deleteAdjustment: async (req, res) => {
    try {
      const deleted = await Adjustment.destroy({
        where: { id: req.params.id, user_id: req.user.id },
      });

      if (!deleted)
        return res.status(404).json({ message: "Adjustment not found" });

      res.json({ message: "Adjustment deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = AdjustmentController;
