const { Customer } = require("../../models");

const CustomerController = {
  // CREATE Customer (Protected)
  createCustomer: async (req, res) => {
    const {
      customer_type,
      company_name,
      display_name,
      email,
      phone,
      currency,
      payment_terms,
      address,
    } = req.body;

    try {
      const customer = await Customer.create({
        customer_type,
        company_name,
        display_name,
        email,
        phone,
        currency,
        payment_terms,
        address,
        user_id: req.user.id,
      });
      res.status(201).json(customer);
    } catch (err) {
      console.error("Error creating customer:", err);
      res.status(500).json({ error: "Failed to create customer" });
    }
  },

  // READ all Customers (User-Specific)
  getAllCustomers: async (req, res) => {
    try {
      const customers = await Customer.findAll({
        where: { user_id: req.user.id },
      });
      res.json(customers);
    } catch (err) {
      console.error("Error fetching customers:", err);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  },

  // READ one Customer by ID (User-Specific)
  getCustomerById: async (req, res) => {
    const { id } = req.params;

    try {
      const customer = await Customer.findOne({
        where: { id, user_id: req.user.id },
      });
      if (!customer)
        return res.status(404).json({ error: "Customer not found" });
      res.json(customer);
    } catch (err) {
      console.error("Error fetching customer:", err);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  },

  // UPDATE Customer (Protected)
  updateCustomer: async (req, res) => {
    const { id } = req.params;
    const {
      customer_type,
      company_name,
      display_name,
      email,
      phone,
      currency,
      payment_terms,
      address,
    } = req.body;

    try {
      const updatedRows = await Customer.update(
        {
          customer_type,
          company_name,
          display_name,
          email,
          phone,
          currency,
          payment_terms,
          address,
        },
        { where: { id, user_id: req.user.id } }
      );

      if (updatedRows[0] === 0)
        return res
          .status(404)
          .json({ error: "Customer not found or not authorized" });
      res.json({ message: "Customer updated successfully" });
    } catch (err) {
      console.error("Error updating customer:", err);
      res.status(500).json({ error: "Failed to update customer" });
    }
  },

  // DELETE Customer (Protected)
  deleteCustomer: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedRows = await Customer.destroy({
        where: { id, user_id: req.user.id },
      });

      if (deletedRows === 0)
        return res
          .status(404)
          .json({ error: "Customer not found or not authorized" });
      res.json({ message: "Customer deleted successfully" });
    } catch (err) {
      console.error("Error deleting customer:", err);
      res.status(500).json({ error: "Failed to delete customer" });
    }
  },
};

module.exports = CustomerController;
