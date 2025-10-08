const { ItemGroup } = require("../../models");

const ItemGroupController = {
  // CREATE Item Group with Image Upload
  createItemGroup: async (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      const imagePath = `/uploads/${req.file.filename}`;

      const group = await ItemGroup.create({
        ...req.body,
        image: imagePath,
        user_id: req.user.id, // Changed from req.userId to req.user.id
      });

      res.status(201).json({
        message: "Item group created successfully",
        group: group,
      });
    } catch (err) {
      console.error("Error creating item group:", err);

      // Clean up uploaded file if there was an error
      if (req.file) {
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({ error: "Failed to create item group" });
    }
  },

  // READ All Item Groups (User-Specific)
  getAllItemGroups: async (req, res) => {
    try {
      const groups = await ItemGroup.findAll({
        where: { user_id: req.user.id }, // Changed from req.userId to req.user.id
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.json(groups);
    } catch (err) {
      console.error("Error fetching item groups:", err);
      res.status(500).json({ error: "Failed to fetch item groups" });
    }
  },

  // READ Single Item Group by ID (User-Specific)
  getItemGroupById: async (req, res) => {
    const { id } = req.params;

    try {
      const group = await ItemGroup.findOne({
        where: { id, user_id: req.user.id }, // Changed from req.userId to req.user.id
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      if (!group)
        return res.status(404).json({ error: "Item group not found" });
      res.json(group);
    } catch (err) {
      console.error("Error fetching item group:", err);
      res.status(500).json({ error: "Failed to fetch item group" });
    }
  },

  // UPDATE Item Group with Image (User-Specific)
  updateItemGroupWithImage: async (req, res) => {
    const { id } = req.params;

    try {
      const group = await ItemGroup.findOne({
        where: { id, user_id: req.user.id }, // Changed from req.userId to req.user.id
      });

      if (!group) {
        return res.status(404).json({
          error: "Item group not found or not authorized",
        });
      }

      const updateData = { ...req.body };

      // If new image is uploaded, update image path and delete old image
      if (req.file) {
        const fs = require("fs");
        const path = require("path");

        // Delete old image if exists
        if (group.image) {
          const oldImagePath = path.join(__dirname, "..", "..", group.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        updateData.image = `/uploads/${req.file.filename}`;
      }

      await group.update(updateData);

      res.json({
        message: "Item group updated successfully",
        group: group,
      });
    } catch (err) {
      console.error("Error updating item group:", err);

      // Clean up uploaded file if there was an error
      if (req.file) {
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({ error: "Failed to update item group" });
    }
  },

  // UPDATE Item Group without Image (User-Specific)
  updateItemGroup: async (req, res) => {
    const { id } = req.params;

    try {
      const group = await ItemGroup.findOne({
        where: { id, user_id: req.user.id }, // Changed from req.userId to req.user.id
      });

      if (!group) {
        return res.status(404).json({
          error: "Item group not found or not authorized",
        });
      }

      await group.update(req.body);

      res.json({
        message: "Item group updated successfully",
        group: group,
      });
    } catch (err) {
      console.error("Error updating item group:", err);
      res.status(500).json({ error: "Failed to update item group" });
    }
  },

  // DELETE Item Group (User-Specific)
  deleteItemGroup: async (req, res) => {
    const { id } = req.params;

    try {
      const group = await ItemGroup.findOne({
        where: { id, user_id: req.user.id }, // Changed from req.userId to req.user.id
      });

      if (!group) {
        return res.status(404).json({
          error: "Item group not found or not authorized",
        });
      }

      // Delete associated image file
      if (group.image) {
        const fs = require("fs");
        const path = require("path");
        const imagePath = path.join(__dirname, "..", "..", group.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await group.destroy();

      res.json({ message: "Item group deleted successfully" });
    } catch (err) {
      console.error("Error deleting item group:", err);
      res.status(500).json({ error: "Failed to delete item group" });
    }
  },
};

module.exports = ItemGroupController;
