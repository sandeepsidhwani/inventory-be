const { Vendor } = require('../../models');

const VendorController = {
  // Create a new vendor
  createVendor: async (req, res) => {
    try {
      const {
        company_name,
        display_name,
        vendor_email,
        vendor_phone,
        currency,
        payment_terms,
        address,
        bank_account_number,
        bank_ifsc_number,
        bank_name,
        bank_account_holder_name,
        remarks,
      } = req.body;

      const newVendor = await Vendor.create(
        {
          company_name,
          display_name,
          vendor_email,
          vendor_phone,
          currency,
          payment_terms,
          address,
          bank_account_number,
          bank_ifsc_number,
          bank_name,
          bank_account_holder_name,
          remarks,
          user_id: req.user.id,
        },
        {
          timestamps: false,
        }
      );

      res.status(201).json(newVendor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all vendors for the logged-in user
  getAllVendors: async (req, res) => {
    try {
      // Verify if user.id is available
      if (!req.user.id) {
        return res.status(400).json({ error: "User ID not provided" });
      }

      // Fetch vendors for the logged-in user
      const vendors = await Vendor.findAll({
        where: { user_id: req.user.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      res.json(vendors);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get a specific vendor by ID for the logged-in user
  getVendorById: async (req, res) => {
    try {
      const vendor = await Vendor.findOne({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });

      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a specific vendor by ID for the logged-in user
  updateVendor: async (req, res) => {
    try {
      const {
        company_name,
        display_name,
        vendor_email,
        vendor_phone,
        currency,
        payment_terms,
        address,
        bank_account_number,
        bank_ifsc_number,
        bank_name,
        bank_account_holder_name,
        remarks,
      } = req.body;

      const [updated] = await Vendor.update(
        {
          company_name,
          display_name,
          vendor_email,
          vendor_phone,
          currency,
          payment_terms,
          address,
          bank_account_number,
          bank_ifsc_number,
          bank_name,
          bank_account_holder_name,
          remarks,
        },
        {
          where: {
            id: req.params.id,
            user_id: req.user.id,
          },
        }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ message: "Vendor not found or not authorized" });
      }

      res.json({ message: "Vendor updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a specific vendor by ID for the logged-in user
  deleteVendor: async (req, res) => {
    try {
      const deleted = await Vendor.destroy({
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      });

      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Vendor not found or not authorized" });
      }

      res.json({ message: "Vendor deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = VendorController;