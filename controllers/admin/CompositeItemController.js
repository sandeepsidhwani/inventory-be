const { CompositeItem } = require("../../models");

const CompositeItemController = {
  // CREATE Composite Item (Protected)
  createCompositeItem: async (req, res) => {
    try {
      console.log("User from token:", req.user); // Debug log

      const item = await CompositeItem.create({
        ...req.body,
        user_id: req.user.id, // Use req.user.id instead of req.userId
      });

      console.log("Created item:", item); // Debug log
      res.status(201).json(item);
    } catch (err) {
      console.error("Error creating composite item:", err);
      res.status(500).json({ error: "Failed to create composite item" });
    }
  },

  // READ All Composite Items (User-Specific)
  getAllCompositeItems: async (req, res) => {
    try {
      const items = await CompositeItem.findAll({
        where: { user_id: req.user.id }, // Use req.user.id
      });
      res.json(items);
    } catch (err) {
      console.error("Error fetching composite items:", err);
      res.status(500).json({ error: "Failed to fetch composite items" });
    }
  },

  // READ Single Composite Item by ID (User-Specific)
  getCompositeItemById: async (req, res) => {
    const { id } = req.params;

    try {
      const item = await CompositeItem.findOne({
        where: { id, user_id: req.user.id }, // Use req.user.id
      });
      if (!item)
        return res.status(404).json({ error: "Composite item not found" });
      res.json(item);
    } catch (err) {
      console.error("Error fetching composite item:", err);
      res.status(500).json({ error: "Failed to fetch composite item" });
    }
  },

  // UPDATE Composite Item (Protected)
  updateCompositeItem: async (req, res) => {
    const { id } = req.params;

    try {
      const updatedRows = await CompositeItem.update(
        { ...req.body },
        { where: { id, user_id: req.user.id } } // Use req.user.id
      );

      if (updatedRows[0] === 0)
        return res
          .status(404)
          .json({ error: "Composite item not found or not authorized" });
      res.json({ message: "Composite item updated successfully" });
    } catch (err) {
      console.error("Error updating composite item:", err);
      res.status(500).json({ error: "Failed to update composite item" });
    }
  },

  // DELETE Composite Item (Protected)
  deleteCompositeItem: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedRows = await CompositeItem.destroy({
        where: { id, user_id: req.user.id }, // Use req.user.id
      });

      if (deletedRows === 0)
        return res
          .status(404)
          .json({ error: "Composite item not found or not authorized" });
      res.json({ message: "Composite item deleted successfully" });
    } catch (err) {
      console.error("Error deleting composite item:", err);
      res.status(500).json({ error: "Failed to delete composite item" });
    }
  },
};

module.exports = CompositeItemController;
