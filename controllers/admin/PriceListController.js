const { PriceList } = require("../../models");

const PriceListController = {
  createPriceList: async (req, res) => {
    const {
      name,
      transaction_type,
      price_list_type,
      description,
      pricing_scheme,
      currency_value,
      discount,
      percentage,
    } = req.body;

    try {
      const priceList = await PriceList.create({
        name,
        transaction_type,
        price_list_type,
        description,
        pricing_scheme,
        currency_value,
        discount,
        percentage,
        user_id: req.user.id, // Changed from req.userId to req.user.id
      });
      res.status(201).json(priceList);
    } catch (err) {
      console.error("Error creating price list:", err);
      res.status(500).json({ error: "Failed to create price list" });
    }
  },

  getAllPriceLists: async (req, res) => {
    try {
      const priceLists = await PriceList.findAll({
        where: { user_id: req.user.id }, // Changed from req.userId to req.user.id
      });
      res.json(priceLists);
    } catch (err) {
      console.error("Error fetching price lists:", err);
      res.status(500).json({ error: "Failed to fetch price lists" });
    }
  },

  getPriceListById: async (req, res) => {
    const { id } = req.params;
    try {
      const priceList = await PriceList.findOne({
        where: { id, user_id: req.user.id }, // Changed from req.userId to req.user.id
      });
      if (!priceList)
        return res.status(404).json({ error: "Price list not found" });
      res.json(priceList);
    } catch (err) {
      console.error("Error fetching price list:", err);
      res.status(500).json({ error: "Failed to fetch price list" });
    }
  },

  updatePriceList: async (req, res) => {
    const { id } = req.params;
    const {
      name,
      transaction_type,
      price_list_type,
      description,
      pricing_scheme,
      currency_value,
      discount,
      percentage,
    } = req.body;

    try {
      const updatedRows = await PriceList.update(
        {
          name,
          transaction_type,
          price_list_type,
          description,
          pricing_scheme,
          currency_value,
          discount,
          percentage,
        },
        { where: { id, user_id: req.user.id } } // Changed from req.userId to req.user.id
      );

      if (updatedRows[0] === 0)
        return res
          .status(404)
          .json({ error: "Price list not found or not authorized" });

      res.json({ message: "Price list updated successfully" });
    } catch (err) {
      console.error("Error updating price list:", err);
      res.status(500).json({ error: "Failed to update price list" });
    }
  },

  deletePriceList: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedRows = await PriceList.destroy({
        where: { id, user_id: req.user.id }, // Changed from req.userId to req.user.id
      });

      if (deletedRows === 0)
        return res
          .status(404)
          .json({ error: "Price list not found or not authorized" });

      res.json({ message: "Price list deleted successfully" });
    } catch (err) {
      console.error("Error deleting price list:", err);
      res.status(500).json({ error: "Failed to delete price list" });
    }
  },
};

module.exports = PriceListController;
