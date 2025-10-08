const { Item } = require("../../models");

const ItemController = {
  // CREATE Item (Protected)
  createItem: async (req, res) => {
    const {
      type,
      name,
      unit,
      weight,
      manufacturer,
      selling_price,
      cost_price,
      description,
    } = req.body;

    try {
      const item = await Item.create(
        {
          type,
          name,
          unit,
          weight,
          manufacturer,
          selling_price,
          cost_price,
          description,
          user_id: req.user.id,
        },
        {
          timestamps: false, // Disable timestamps explicitly for this query
        }
      );

      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // READ all Items (User-Specific)
  getAllItems: async (req, res) => {
    try {
      const items = await Item.findAll({
        where: { user_id: req.user.id },
        attributes: [
          "id",
          "type",
          "name",
          "unit",
          "weight",
          "manufacturer",
          "selling_price",
          "cost_price",
          "description",
        ],
      });

      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // READ one Item by ID (User-Specific)
  getItemById: async (req, res) => {
    const { id } = req.params;

    try {
      const item = await Item.findOne({
        where: { id, user_id: req.user.id },
        attributes: [
          "id",
          "type",
          "name",
          "unit",
          "weight",
          "manufacturer",
          "selling_price",
          "cost_price",
          "description",
        ],
      });

      if (!item) return res.status(404).json({ error: "Item not found" });

      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // UPDATE Item (Protected)
  updateItem: async (req, res) => {
    const { id } = req.params;
    const {
      type,
      name,
      unit,
      weight,
      manufacturer,
      selling_price,
      cost_price,
      description,
    } = req.body;

    try {
      const item = await Item.findOne({ where: { id, user_id: req.user.id } });

      if (!item) return res.status(404).json({ error: "Item not found" });

      await item.update({
        type,
        name,
        unit,
        weight,
        manufacturer,
        selling_price,
        cost_price,
        description,
      });

      res.json({ message: "Item updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE Item (Protected)
  deleteItem: async (req, res) => {
    const { id } = req.params;

    try {
      const rowsDeleted = await Item.destroy({
        where: { id, user_id: req.user.id },
      });

      if (!rowsDeleted)
        return res.status(404).json({ message: "Item not found" });

      res.json({ message: "Item deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = ItemController;
