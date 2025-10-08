const { Inventory } = require("../../models");
const db = require("../../db");

const InventoryController = {
  // CREATE Inventory Item (Protected)
  createInventory: (req, res) => {
    const { name, quantity, price } = req.body;
    const query =
      "INSERT INTO inventory (name, quantity, price, user_id) VALUES (?, ?, ?, ?)";
    db.query(query, [name, quantity, price, req.userId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, quantity, price });
    });
  },

  // READ all Inventory Items (User-Specific)
  getAllInventory: (req, res) => {
    const query = "SELECT * FROM inventory WHERE user_id = ?";
    db.query(query, [req.userId], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  },

  // READ one Inventory Item by ID (User-Specific)
  getInventoryById: (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM inventory WHERE id = ? AND user_id = ?";
    db.query(query, [id, req.userId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0)
        return res.status(404).json({ error: "Item not found" });
      res.json(result[0]);
    });
  },

  // UPDATE Inventory Item (Protected)
  updateInventory: (req, res) => {
    const { id } = req.params;
    const { name, quantity, price } = req.body;
    const query =
      "UPDATE inventory SET name = ?, quantity = ?, price = ? WHERE id = ? AND user_id = ?";
    db.query(query, [name, quantity, price, id, req.userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Item updated successfully" });
    });
  },

  // DELETE Inventory Item (Protected)
  deleteInventory: (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM inventory WHERE id = ? AND user_id = ?";
    db.query(query, [id, req.userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Item deleted successfully" });
    });
  },
};

module.exports = InventoryController;
