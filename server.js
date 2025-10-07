const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Import MySQL connection
const { User } = require('./models');
const { Bill } = require('./models');
const { Challan } = require('./models');
const { Item } = require('./models');
const { Adjustment } = require('./models');
const { Invoice } = require('./models');
const { RetainerInvoice } = require('./models');
const { SalesOrder } = require('./models');
const { CreditNote } = require('./models');
const { Vendor } = require('./models');
const { PurchaseOrder } = require('./models');
const { BillPayment } = require('./models');
const { VendorAdvance } = require('./models');
const { VendorCredit } = require('./models');
const sequelize = require('./db');
const { Customer } = require('./models');
const { CompositeItem } = require('./models');
const { ItemGroup } = require('./models');
const { PriceList } = require('./models');
const { Shipment } = require('./models');
const { PaymentReceived } = require('./models');
const { SalesReturn } = require('./models');
const { PurchaseReceive } = require('./models');
const { PaymentsMade } = require('./models');
const app = express();
const authenticateToken = require('./middlewares/authMiddleware');
app.use(cors()); // Enable CORS for frontend access
app.use(bodyParser.json()); // Parse JSON request body
app.use('/uploads', express.static('uploads'));
const SECRET_KEY = 'abcdbc2344';

const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });


// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  // Extract token from the 'Authorization' header
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

  // If there's no token, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err || !decoded.id) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // Add user id to request for use in later routes
    req.userId = decoded.id;
    next();  // Proceed to the next middleware or route handler
  });
};


app.post('/api/register', async (req, res) => {
  const { name, username, email, password, mobileno, gender } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      mobileno,
      gender,
    });
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        mobileno: user.mobileno,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'username', 'email', 'mobileno', 'gender'],
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.update({ password: hashedPassword }, { where: { email } });
    if (!user[0]) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error during password update:', err);
    res.status(500).json({ error: err.message });
  }
});


// CREATE Inventory Item (Protected)
app.post('/api/inventory', authenticate, (req, res) => {
  const { name, quantity, price } = req.body;
  const query = 'INSERT INTO inventory (name, quantity, price, user_id) VALUES (?, ?, ?, ?)';
  db.query(query, [name, quantity, price, req.userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, quantity, price });
  });
});

// READ all Inventory Items (User-Specific)
app.get('/api/inventory', authenticate, (req, res) => {
  const query = 'SELECT * FROM inventory WHERE user_id = ?';
  db.query(query, [req.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// READ one Inventory Item by ID (User-Specific)
app.get('/api/inventory/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM inventory WHERE id = ? AND user_id = ?';
  db.query(query, [id, req.userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(result[0]);
  });
});

// UPDATE Inventory Item (Protected)
app.put('/api/inventory/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;
  const query = 'UPDATE inventory SET name = ?, quantity = ?, price = ? WHERE id = ? AND user_id = ?';
  db.query(query, [name, quantity, price, id, req.userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item updated successfully' });
  });
});

// DELETE Inventory Item (Protected)
app.delete('/api/inventory/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM inventory WHERE id = ? AND user_id = ?';
  db.query(query, [id, req.userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Item deleted successfully' });
  });
});

// CREATE Composite Item (Protected)
app.post('/api/composite-items', authenticate, async (req, res) => {
  try {
    const item = await CompositeItem.create({
      ...req.body,
      user_id: req.userId, // Inject user ID from authenticated user
    });
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating composite item:', err);
    res.status(500).json({ error: 'Failed to create composite item' });
  }
});

// READ All Composite Items (User-Specific)
app.get('/api/composite-items', authenticate, async (req, res) => {
  try {
    const items = await CompositeItem.findAll({
      where: { user_id: req.userId },
    });
    res.json(items);
  } catch (err) {
    console.error('Error fetching composite items:', err);
    res.status(500).json({ error: 'Failed to fetch composite items' });
  }
});

// READ Single Composite Item by ID (User-Specific)
app.get('/api/composite-items/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const item = await CompositeItem.findOne({
      where: { id, user_id: req.userId },
    });
    if (!item) return res.status(404).json({ error: 'Composite item not found' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching composite item:', err);
    res.status(500).json({ error: 'Failed to fetch composite item' });
  }
});

// UPDATE Composite Item (Protected)
app.put('/api/composite-items/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const updatedRows = await CompositeItem.update(
      { ...req.body },
      { where: { id, user_id: req.userId } }
    );

    if (updatedRows[0] === 0) return res.status(404).json({ error: 'Composite item not found or not authorized' });
    res.json({ message: 'Composite item updated successfully' });
  } catch (err) {
    console.error('Error updating composite item:', err);
    res.status(500).json({ error: 'Failed to update composite item' });
  }
});

// DELETE Composite Item (Protected)
app.delete('/api/composite-items/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await CompositeItem.destroy({
      where: { id, user_id: req.userId },
    });

    if (deletedRows === 0) return res.status(404).json({ error: 'Composite item not found or not authorized' });
    res.json({ message: 'Composite item deleted successfully' });
  } catch (err) {
    console.error('Error deleting composite item:', err);
    res.status(500).json({ error: 'Failed to delete composite item' });
  }
});

// CREATE Item Group
app.post('/api/item-groups', authenticate, upload.single('imageFile'), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const group = await ItemGroup.create({
      ...req.body,
      image: imagePath,
      user_id: req.userId,
    });

    res.status(201).json(group);
  } catch (err) {
    console.error('Error creating item group:', err);
    res.status(500).json({ error: 'Failed to create item group' });
  }
});

// READ All Item Groups (User-Specific)
app.get('/api/item-groups', authenticate, async (req, res) => {
  try {
    const groups = await ItemGroup.findAll({
      where: { user_id: req.userId },
    });
    res.json(groups);
  } catch (err) {
    console.error('Error fetching item groups:', err);
    res.status(500).json({ error: 'Failed to fetch item groups' });
  }
});

// READ Single Item Group by ID (User-Specific)
app.get('/api/item-groups/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const group = await ItemGroup.findOne({
      where: { id, user_id: req.userId },
    });
    if (!group) return res.status(404).json({ error: 'Item group not found' });
    res.json(group);
  } catch (err) {
    console.error('Error fetching item group:', err);
    res.status(500).json({ error: 'Failed to fetch item group' });
  }
});

// UPDATE Item Group (User-Specific)
app.put('/api/item-groups/:id', authenticate,upload.single('imageFile'), async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  console.log('Updating ItemGroup with ID:', id);
  console.log('Authenticated User ID:', userId);
  console.log('Request Body:', req.body); // Helpful debug

  try {
    const group = await ItemGroup.findOne({ where: { id, user_id: userId } });

    if (!group) {
      return res.status(404).json({ error: 'Item group not found or not authorized' });
    }

    await group.update(req.body);

    res.json({ message: 'Item group updated successfully', group });
  } catch (err) {
    console.error('Error updating item group:', err);
    res.status(500).json({ error: 'Failed to update item group' });
  }
});


// DELETE Item Group (User-Specific)
app.delete('/api/item-groups/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await ItemGroup.destroy({
      where: { id, user_id: req.userId },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Item group not found or not authorized' });
    }

    res.json({ message: 'Item group deleted successfully' });
  } catch (err) {
    console.error('Error deleting item group:', err);
    res.status(500).json({ error: 'Failed to delete item group' });
  }
});


// CREATE PriceList (Protected)
app.post('/api/pricelists', authenticate, async (req, res) => {
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
      user_id: req.userId, // Authenticated user ID
    });
    res.status(201).json(priceList);
  } catch (err) {
    console.error('Error creating price list:', err);
    res.status(500).json({ error: 'Failed to create price list' });
  }
});

// READ all PriceLists (User-Specific)
app.get('/api/pricelists', authenticate, async (req, res) => {
  try {
    const priceLists = await PriceList.findAll({
      where: { user_id: req.userId },
    });
    res.json(priceLists);
  } catch (err) {
    console.error('Error fetching price lists:', err);
    res.status(500).json({ error: 'Failed to fetch price lists' });
  }
});

// READ one PriceList by ID (User-Specific)
app.get('/api/pricelists/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const priceList = await PriceList.findOne({
      where: { id, user_id: req.userId },
    });
    if (!priceList) return res.status(404).json({ error: 'Price list not found' });
    res.json(priceList);
  } catch (err) {
    console.error('Error fetching price list:', err);
    res.status(500).json({ error: 'Failed to fetch price list' });
  }
});

// UPDATE PriceList (Protected)
app.put('/api/pricelists/:id', authenticate, async (req, res) => {
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
      {
        where: { id, user_id: req.userId },
      }
    );

    if (updatedRows[0] === 0)
      return res.status(404).json({ error: 'Price list not found or not authorized' });

    res.json({ message: 'Price list updated successfully' });
  } catch (err) {
    console.error('Error updating price list:', err);
    res.status(500).json({ error: 'Failed to update price list' });
  }
});

// DELETE PriceList (Protected)
app.delete('/api/pricelists/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await PriceList.destroy({
      where: { id, user_id: req.userId },
    });

    if (deletedRows === 0)
      return res.status(404).json({ error: 'Price list not found or not authorized' });

    res.json({ message: 'Price list deleted successfully' });
  } catch (err) {
    console.error('Error deleting price list:', err);
    res.status(500).json({ error: 'Failed to delete price list' });
  }
});

// CREATE Shipment (Protected)
app.post('/api/shipments', authenticate, async (req, res) => {
  const {
    customer_name,
    sales_order,
    package: packageType,
    shipment_order,
    ship_date,
    carrier,
    tracking,
    tracking_url,
    shipping_charges,
    status,
  } = req.body;

  try {
    const shipment = await Shipment.create({
      customer_name,
      sales_order,
      package: packageType,
      shipment_order,
      ship_date,
      carrier,
      tracking,
      tracking_url,
      shipping_charges,
      status,
      user_id: req.userId, // Authenticated user ID
    });
    res.status(201).json(shipment);
  } catch (err) {
    console.error('Error creating shipment:', err);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// READ all Shipments (User-Specific)
app.get('/api/shipments', authenticate, async (req, res) => {
  try {
    const shipments = await Shipment.findAll({
      where: { user_id: req.userId },
    });
    res.json(shipments);
  } catch (err) {
    console.error('Error fetching shipments:', err);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// READ one Shipment by ID (User-Specific)
app.get('/api/shipments/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const shipment = await Shipment.findOne({
      where: { id, user_id: req.userId },
    });
    if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
    res.json(shipment);
  } catch (err) {
    console.error('Error fetching shipment:', err);
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
});

// UPDATE Shipment (Protected)
app.put('/api/shipments/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const {
    customer_name,
    sales_order,
    package: packageType,
    shipment_order,
    ship_date,
    carrier,
    tracking,
    tracking_url,
    shipping_charges,
    status,
  } = req.body;

  try {
    const updatedRows = await Shipment.update(
      {
        customer_name,
        sales_order,
        package: packageType,
        shipment_order,
        ship_date,
        carrier,
        tracking,
        tracking_url,
        shipping_charges,
        status,
      },
      {
        where: { id, user_id: req.userId },
      }
    );

    if (updatedRows[0] === 0)
      return res.status(404).json({ error: 'Shipment not found or not authorized' });

    res.json({ message: 'Shipment updated successfully' });
  } catch (err) {
    console.error('Error updating shipment:', err);
    res.status(500).json({ error: 'Failed to update shipment' });
  }
});

// DELETE Shipment (Protected)
app.delete('/api/shipments/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await Shipment.destroy({
      where: { id, user_id: req.userId },
    });

    if (deletedRows === 0)
      return res.status(404).json({ error: 'Shipment not found or not authorized' });

    res.json({ message: 'Shipment deleted successfully' });
  } catch (err) {
    console.error('Error deleting shipment:', err);
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
});

app.post('/api/payments-received', authenticate, async (req, res) => {
  try {
    const payment = await PaymentReceived.create({
      ...req.body,
      user_id: req.userId,
    });
    res.status(201).json(payment);
  } catch (err) {
    console.error('Error creating payment record:', err);
    res.status(500).json({ error: 'Failed to create payment record' });
  }
});

app.get('/api/payments-received', authenticate, async (req, res) => {
  try {
    const payments = await PaymentReceived.findAll({
      where: { user_id: req.userId },
    });
    res.json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

app.get('/api/payments-received/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await PaymentReceived.findOne({
      where: { id, user_id: req.userId },
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    console.error('Error fetching payment:', err);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

app.put('/api/payments-received/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await PaymentReceived.update(
      { ...req.body },
      { where: { id, user_id: req.userId } }
    );
    if (updated[0] === 0) return res.status(404).json({ error: 'Payment not found or not authorized' });
    res.json({ message: 'Payment updated successfully' });
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

app.delete('/api/payments-received/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await PaymentReceived.destroy({
      where: { id, user_id: req.userId },
    });
    if (deleted === 0) return res.status(404).json({ error: 'Payment not found or not authorized' });
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

// CREATE purchase receive
app.post('/api/purchase-receives', authenticate, async (req, res) => {
  try {
    const purchase = await PurchaseReceive.create({
      ...req.body,
      user_id: req.userId,
    });
    res.status(201).json(purchase);
  } catch (err) {
    console.error('Error creating purchase receive:', err);
    res.status(500).json({ error: 'Failed to create purchase receive' });
  }
});

// READ all purchase receives for user
app.get('/api/purchase-receives', authenticate, async (req, res) => {
  try {
    const purchases = await PurchaseReceive.findAll({
      where: { user_id: req.userId },
    });
    res.json(purchases);
  } catch (err) {
    console.error('Error fetching purchase receives:', err);
    res.status(500).json({ error: 'Failed to fetch purchase receives' });
  }
});

// READ a single purchase receive by ID
app.get('/api/purchase-receives/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const purchase = await PurchaseReceive.findOne({
      where: { id, user_id: req.userId },
    });
    if (!purchase) return res.status(404).json({ error: 'Purchase receive not found' });
    res.json(purchase);
  } catch (err) {
    console.error('Error fetching purchase receive:', err);
    res.status(500).json({ error: 'Failed to fetch purchase receive' });
  }
});

// UPDATE purchase receive
app.put('/api/purchase-receives/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await PurchaseReceive.update(
      { ...req.body },
      { where: { id, user_id: req.userId } }
    );
    if (updated[0] === 0)
      return res.status(404).json({ error: 'Purchase receive not found or not authorized' });
    res.json({ message: 'Purchase receive updated successfully' });
  } catch (err) {
    console.error('Error updating purchase receive:', err);
    res.status(500).json({ error: 'Failed to update purchase receive' });
  }
});

// DELETE purchase receive
app.delete('/api/purchase-receives/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await PurchaseReceive.destroy({
      where: { id, user_id: req.userId },
    });
    if (deleted === 0)
      return res.status(404).json({ error: 'Purchase receive not found or not authorized' });
    res.json({ message: 'Purchase receive deleted successfully' });
  } catch (err) {
    console.error('Error deleting purchase receive:', err);
    res.status(500).json({ error: 'Failed to delete purchase receive' });
  }
});

// CREATE a new payment made
app.post('/api/payments-made', authenticate, async (req, res) => {
  try {
    const payment = await PaymentsMade.create({
      ...req.body,
      user_id: req.userId,
    });
    res.status(201).json(payment);
  } catch (err) {
    console.error('Error creating payment made:', err);
    res.status(500).json({ error: 'Failed to create payment made' });
  }
});

// READ all payments made by user
app.get('/api/payments-made', authenticate, async (req, res) => {
  try {
    const payments = await PaymentsMade.findAll({
      where: { user_id: req.userId },
    });
    res.json(payments);
  } catch (err) {
    console.error('Error fetching payments made:', err);
    res.status(500).json({ error: 'Failed to fetch payments made' });
  }
});

// READ single payment made by ID
app.get('/api/payments-made/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await PaymentsMade.findOne({
      where: { id, user_id: req.userId },
    });
    if (!payment) return res.status(404).json({ error: 'Payment made not found' });
    res.json(payment);
  } catch (err) {
    console.error('Error fetching payment made:', err);
    res.status(500).json({ error: 'Failed to fetch payment made' });
  }
});

// UPDATE payment made by ID
app.put('/api/payments-made/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await PaymentsMade.update(
      { ...req.body },
      { where: { id, user_id: req.userId } }
    );
    if (updated[0] === 0)
      return res.status(404).json({ error: 'Payment made not found or not authorized' });
    res.json({ message: 'Payment made updated successfully' });
  } catch (err) {
    console.error('Error updating payment made:', err);
    res.status(500).json({ error: 'Failed to update payment made' });
  }
});

// DELETE payment made
app.delete('/api/payments-made/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await PaymentsMade.destroy({
      where: { id, user_id: req.userId },
    });
    if (deleted === 0)
      return res.status(404).json({ error: 'Payment made not found or not authorized' });
    res.json({ message: 'Payment made deleted successfully' });
  } catch (err) {
    console.error('Error deleting payment made:', err);
    res.status(500).json({ error: 'Failed to delete payment made' });
  }
});


// CREATE Sales Return
app.post('/api/sales-returns', authenticate, async (req, res) => {
  try {
    const salesReturn = await SalesReturn.create({
      ...req.body,
      user_id: req.userId,
    });
    res.status(201).json(salesReturn);
  } catch (err) {
    console.error('Error creating sales return:', err);
    res.status(500).json({ error: 'Failed to create sales return' });
  }
});

// READ All Sales Returns (User-Specific)
app.get('/api/sales-returns', authenticate, async (req, res) => {
  try {
    const returns = await SalesReturn.findAll({
      where: { user_id: req.userId },
    });
    res.json(returns);
  } catch (err) {
    console.error('Error fetching sales returns:', err);
    res.status(500).json({ error: 'Failed to fetch sales returns' });
  }
});

// READ Single Sales Return by ID
app.get('/api/sales-returns/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const salesReturn = await SalesReturn.findOne({
      where: { id, user_id: req.userId },
    });
    if (!salesReturn) return res.status(404).json({ error: 'Sales return not found' });
    res.json(salesReturn);
  } catch (err) {
    console.error('Error fetching sales return:', err);
    res.status(500).json({ error: 'Failed to fetch sales return' });
  }
});

// UPDATE Sales Return
app.put('/api/sales-returns/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await SalesReturn.update(
      { ...req.body },
      { where: { id, user_id: req.userId } }
    );
    if (updated[0] === 0) return res.status(404).json({ error: 'Sales return not found or not authorized' });
    res.json({ message: 'Sales return updated successfully' });
  } catch (err) {
    console.error('Error updating sales return:', err);
    res.status(500).json({ error: 'Failed to update sales return' });
  }
});

// DELETE Sales Return
app.delete('/api/sales-returns/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await SalesReturn.destroy({
      where: { id, user_id: req.userId },
    });
    if (deleted === 0) return res.status(404).json({ error: 'Sales return not found or not authorized' });
    res.json({ message: 'Sales return deleted successfully' });
  } catch (err) {
    console.error('Error deleting sales return:', err);
    res.status(500).json({ error: 'Failed to delete sales return' });
  }
});




// CREATE Customer (Protected)
app.post('/api/customers', authenticate, async (req, res) => {
  const { customer_type, company_name, display_name, email, phone, currency, payment_terms, address } = req.body;

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
      user_id: req.userId, // Inject user ID from authenticated user
    });
    res.status(201).json(customer);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});


// READ all Customers (User-Specific)
app.get('/api/customers', authenticate, async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: { user_id: req.userId },
    });
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});


// READ one Customer by ID (User-Specific)
app.get('/api/customers/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findOne({
      where: { id, user_id: req.userId },
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});


// UPDATE Customer (Protected)
app.put('/api/customers/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { customer_type, company_name, display_name, email, phone, currency, payment_terms, address } = req.body;

  try {
    const updatedRows = await Customer.update(
      { customer_type, company_name, display_name, email, phone, currency, payment_terms, address },
      { where: { id, user_id: req.userId } }
    );

    if (updatedRows[0] === 0) return res.status(404).json({ error: 'Customer not found or not authorized' });
    res.json({ message: 'Customer updated successfully' });
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});


// DELETE Customer (Protected)
app.delete('/api/customers/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await Customer.destroy({
      where: { id, user_id: req.userId },
    });

    if (deletedRows === 0) return res.status(404).json({ error: 'Customer not found or not authorized' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});



// CREATE Bill (Protected)
app.post('/api/bills', authenticate, async (req, res) => {
  const {
    vendor_name,
    bill_no,
    order_no,
    bill_date,
    due_date,
    item_name,
    quantity,
    rate,
    discount,
    tds,
    total,
  } = req.body;

  try {
    // Input validation
    if (!vendor_name || !bill_no || !bill_date || !due_date || !item_name || !quantity || !rate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the bill
    const bill = await Bill.create({
      vendor_name,
      bill_no,
      order_no,
      bill_date,
      due_date,
      item_name,
      quantity,
      rate,
      discount,
      tds,
      total,
      user_id: req.userId,
    },
    {
      timestamps: false, // Disable timestamps explicitly for this query
    });

    res.status(201).json(bill);
  } catch (err) {
    console.error('Error creating bill:', err);

    // Check for specific Sequelize errors
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Invalid data provided', details: err.errors });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Bill number must be unique' });
    }

    res.status(500).json({ error: 'Failed to create bill' });
  }
});



// READ all Bills (User-Specific)
app.get('/api/bills', authenticate, async (req, res) => {
  try {
    const bills = await Bill.findAll({
      where: { user_id: req.userId },
      attributes: [
        'id',
        'vendor_name',
        'bill_no',
        'order_no',
        [sequelize.fn('DATE_FORMAT', sequelize.col('bill_date'), '%Y-%m-%d'), 'bill_date'],
        [sequelize.fn('DATE_FORMAT', sequelize.col('due_date'), '%Y-%m-%d'), 'due_date'],
        'item_name',
        'quantity',
        'rate',
        'discount',
        'tds',
        'total',
      ],
    });
    res.json(bills);
  } catch (err) {
    console.error('Error fetching bills:', err);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});


// READ one Bill by ID (User-Specific)
app.get('/api/bills/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const bill = await Bill.findOne({
      where: { id, user_id: req.userId },
      attributes: [
        'id',
        'vendor_name',
        'bill_no',
        'order_no',
        [sequelize.fn('DATE_FORMAT', sequelize.col('bill_date'), '%Y-%m-%d'), 'bill_date'],
        [sequelize.fn('DATE_FORMAT', sequelize.col('due_date'), '%Y-%m-%d'), 'due_date'],
        'item_name',
        'quantity',
        'rate',
        'discount',
        'tds',
        'total',
      ],
    });

    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    console.error('Error fetching bill:', err);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
});


// UPDATE Bill (Protected)
app.put('/api/bills/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { vendor_name, bill_no, order_no, bill_date, due_date, item_name, quantity, rate, discount, tds, total } = req.body;

  try {
    const [updatedRows] = await Bill.update(
      { vendor_name, bill_no, order_no, bill_date, due_date, item_name, quantity, rate, discount, tds, total },
      { where: { id, user_id: req.userId } }
    );

    if (updatedRows === 0) return res.status(404).json({ error: 'Bill not found or not authorized' });
    res.json({ message: 'Bill updated successfully' });
  } catch (err) {
    console.error('Error updating bill:', err);
    res.status(500).json({ error: 'Failed to update bill' });
  }
});


// DELETE Bill (Protected)
app.delete('/api/bills/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await Bill.destroy({
      where: { id, user_id: req.userId },
    });

    if (deletedRows === 0) return res.status(404).json({ error: 'Bill not found or not authorized' });
    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    console.error('Error deleting bill:', err);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
});




// CREATE Challan (Protected)
app.post('/api/challans', authenticate, async (req, res) => {
  const {
    customer_name, challan_number, challan_date, challan_type,
    item_name, quantity, rate, discount, total, customer_notes, terms_condition
  } = req.body;

  try {
    const challan = await Challan.create({
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
      user_id: req.userId,
    },
    {
      timestamps: false, // Disable timestamps explicitly for this query
    });

    res.status(201).json(challan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// READ all Challans (User-Specific)
app.get('/api/challans', authenticate, async (req, res) => {
  try {
    const challans = await Challan.findAll({
      where: { user_id: req.userId },
      attributes: [
        'id', 'customer_name', 'challan_number', 'challan_date', 'challan_type',
        'item_name', 'quantity', 'rate', 'discount', 'total', 'customer_notes', 'terms_condition',
      ],
    });

    res.json(challans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// READ one Challan by ID (User-Specific)
app.get('/api/challans/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const challan = await Challan.findOne({
      where: { id, user_id: req.userId },
      attributes: [
        'id', 'customer_name', 'challan_number', 'challan_date', 'challan_type',
        'item_name', 'quantity', 'rate', 'discount', 'total', 'customer_notes', 'terms_condition',
      ],
    });

    if (!challan) return res.status(404).json({ error: 'Challan not found' });

    res.json(challan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE Challan (Protected)
app.put('/api/challans/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const {
    customer_name, challan_number, challan_date, challan_type,
    item_name, quantity, rate, discount, total, customer_notes, terms_condition
  } = req.body;

  try {
    const challan = await Challan.findOne({ where: { id, user_id: req.userId } });

    if (!challan) return res.status(404).json({ error: 'Challan not found' });

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

    res.json({ message: 'Challan updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE Challan (Protected)
app.delete('/api/challans/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await Challan.destroy({
      where: { id, user_id: req.userId },
    });

    if (!rowsDeleted) return res.status(404).json({ message: 'Challan not found' });

    res.json({ message: 'Challan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CREATE Item (Protected)
app.post('/api/items', authenticate, async (req, res) => {
  const {
    type, name, unit, weight, manufacturer, selling_price, cost_price, description
  } = req.body;

  try {
    const item = await Item.create({
      type,
      name,
      unit,
      weight,
      manufacturer,
      selling_price,
      cost_price,
      description,
      user_id: req.userId,
    },
    {
      timestamps: false, // Disable timestamps explicitly for this query
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// READ all Items (User-Specific)
app.get('/api/items', authenticate, async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { user_id: req.userId },
      attributes: [
        'id', 'type', 'name', 'unit', 'weight', 'manufacturer',
        'selling_price', 'cost_price', 'description',
      ],
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// READ one Item by ID (User-Specific)
app.get('/api/items/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findOne({
      where: { id, user_id: req.userId },
      attributes: [
        'id', 'type', 'name', 'unit', 'weight', 'manufacturer',
        'selling_price', 'cost_price', 'description',
      ],
    });

    if (!item) return res.status(404).json({ error: 'Item not found' });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE Item (Protected)
app.put('/api/items/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const {
    type, name, unit, weight, manufacturer, selling_price, cost_price, description
  } = req.body;

  try {
    const item = await Item.findOne({ where: { id, user_id: req.userId } });

    if (!item) return res.status(404).json({ error: 'Item not found' });

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

    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE Item (Protected)
app.delete('/api/items/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await Item.destroy({
      where: { id, user_id: req.userId },
    });

    if (!rowsDeleted) return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CREATE new adjustment (Protected)
app.post('/api/adjustments', authenticate, async (req, res) => {
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

    const adjustment = await Adjustment.create({
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
      user_id: req.userId,
    },
    {
      timestamps: false, // Disable timestamps explicitly for this query
    });

    res.status(201).json(adjustment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// READ all adjustments (User-Specific)
app.get('/api/adjustments', authenticate, async (req, res) => {
  try {
    const adjustments = await Adjustment.findAll({
      where: { user_id: req.userId },attributes: { exclude: ['createdAt', 'updatedAt'] }, });
    res.json(adjustments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// READ one adjustment by ID (User-Specific)
app.get('/api/adjustments/:id', authenticate, async (req, res) => {
  try {
    const adjustment = await Adjustment.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!adjustment) return res.status(404).json({ message: 'Adjustment not found' });

    res.json(adjustment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE adjustment (Protected)
app.put('/api/adjustments/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Adjustment.update(req.body, {
      where: { id, user_id: req.userId },
    });

    if (!updated[0]) return res.status(404).json({ message: 'Adjustment not found' });

    res.json({ message: 'Adjustment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE adjustment (Protected)
app.delete('/api/adjustments/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Adjustment.destroy({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!deleted) return res.status(404).json({ message: 'Adjustment not found' });

    res.json({ message: 'Adjustment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CREATE new invoice
app.post('/api/invoices', authenticate, async (req, res) => {
  try {
    const newInvoice = await Invoice.create({ ...req.body, user_id: req.userId });
    res.json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all invoices (User-Specific)
app.get('/api/invoices', authenticate, async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ where: { user_id: req.userId } });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one invoice by ID (User-Specific)
app.get('/api/invoices/:id', authenticate, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE invoice
app.put('/api/invoices/:id', authenticate, async (req, res) => {
  try {
    // Check if the invoice exists
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update the invoice
    await invoice.update(req.body);

    res.json({ message: 'Invoice updated successfully', invoice });
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({ error: err.message });
  }
});



// DELETE invoice
app.delete('/api/invoices/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Invoice.destroy({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!deleted) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Create a new retainer invoice (Protected)
app.post('/api/retainerinvoices', authenticate, async (req, res) => {
  try {
    const {
      customer_name,
      retainer_invoice_number,
      reference_number,
      retainer_invoice_date,
      description,
      amount,
      customer_notes,
      terms_conditions,
      email_communications,
    } = req.body;

    const newInvoice = await RetainerInvoice.create({
      customer_name,
      retainer_invoice_number,
      reference_number,
      retainer_invoice_date,
      description,
      amount,
      customer_notes,
      terms_conditions,
      email_communications,
      user_id: req.userId, // Adding the user ID from authentication
    });

    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all retainer invoices (User-Specific)
app.get('/api/retainerinvoices', authenticate, async (req, res) => {
  try {
    const invoices = await RetainerInvoice.findAll({ where: { user_id: req.userId } });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific retainer invoice by ID (User-Specific)
app.get('/api/retainerinvoices/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await RetainerInvoice.findOne({ where: { id, user_id: req.userId } });

    if (!invoice) {
      return res.status(404).json({ message: 'Retainer invoice not found' });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a specific retainer invoice by ID (Protected)
// Update a specific retainer invoice by ID (Protected)
app.put('/api/retainerinvoices/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const {
      customer_name,
      retainer_invoice_number,
      reference_number,
      retainer_invoice_date,
      description,
      amount,
      customer_notes,
      terms_conditions,
      email_communications,
    } = req.body;

    console.log('Retainer Invoice ID:', id);
    console.log('User ID:', userId);
    console.log('Request Body:', req.body);

    // Validate input fields
    if (!id || !userId) {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }

    // Update the retainer invoice
    const [updatedRows] = await RetainerInvoice.update(
      {
        customer_name,
        retainer_invoice_number,
        reference_number,
        retainer_invoice_date,
        description,
        amount,
        customer_notes,
        terms_conditions,
        email_communications,
      },
      {
        where: { id, user_id: userId },
      }
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Retainer invoice not found or not authorized' });
    }

    res.json({ message: 'Retainer invoice updated successfully' });
  } catch (err) {
    console.error('Error updating retainer invoice:', err);
    res.status(500).json({ error: err.message });
  }
});


// Delete a specific retainer invoice by ID (Protected)
app.delete('/api/retainerinvoices/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await RetainerInvoice.destroy({ where: { id, user_id: req.userId } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Retainer invoice not found or not authorized' });
    }

    res.json({ message: 'Retainer invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create a new sales order
app.post('/api/salesorders', authenticate, async (req, res) => {
  try {
    const {
      customer_name,
      sales_order_number,
      reference_number,
      sales_order_date,
      expected_shipment_date,
      payment_terms,
      delivery_method,
      salesperson,
      item_name,
      quantity,
      rate,
      discount,
      amount,
      customer_notes,
      terms_conditions,
    } = req.body;

    const newSalesOrder = await SalesOrder.create({
      customer_name,
      sales_order_number,
      reference_number,
      sales_order_date,
      expected_shipment_date,
      payment_terms,
      delivery_method,
      salesperson,
      item_name,
      quantity,
      rate,
      discount,
      amount,
      customer_notes,
      terms_conditions,
      user_id: req.userId, // Associate with authenticated user
    },
    {
      timestamps: false, // Disable timestamps explicitly for this query
    });

    res.status(201).json(newSalesOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sales orders for the logged-in user
app.get('/api/salesorders', authenticate, async (req, res) => {
  try {
    const salesOrders = await SalesOrder.findAll({
      where: { user_id: req.userId },attributes: { exclude: ['createdAt', 'updatedAt'] }, });
    res.json(salesOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific sales order by ID for the logged-in user
app.get('/api/salesorders/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const salesOrder = await SalesOrder.findOne({ where: { id, user_id: req.userId } });

    if (!salesOrder) {
      return res.status(404).json({ message: 'Sales order not found' });
    }

    res.json(salesOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a specific sales order by ID for the logged-in user
app.put('/api/salesorders/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_name,
      sales_order_number,
      reference_number,
      sales_order_date,
      expected_shipment_date,
      payment_terms,
      delivery_method,
      salesperson,
      item_name,
      quantity,
      rate,
      discount,
      amount,
      customer_notes,
      terms_conditions,
    } = req.body;

    const [updatedRows] = await SalesOrder.update(
      {
        customer_name,
        sales_order_number,
        reference_number,
        sales_order_date,
        expected_shipment_date,
        payment_terms,
        delivery_method,
        salesperson,
        item_name,
        quantity,
        rate,
        discount,
        amount,
        customer_notes,
        terms_conditions,
      },
      { where: { id, user_id: req.userId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Sales order not found or not authorized' });
    }

    res.json({ message: 'Sales order updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a specific sales order by ID for the logged-in user
app.delete('/api/salesorders/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await SalesOrder.destroy({ where: { id, user_id: req.userId } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Sales order not found or not authorized' });
    }

    res.json({ message: 'Sales order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Create a new credit note
app.post('/api/creditnotes', authenticate, async (req, res) => {
  try {
    const {
      customer_name,
      credit_note_number,
      reference_number,
      credit_note_date,
      salesperson,
      item_name,
      account,
      quantity,
      rate,
      discount,
      amount,
      customer_notes,
      terms_conditions,
    } = req.body;

    const newCreditNote = await CreditNote.create({
      customer_name,
      credit_note_number,
      reference_number,
      credit_note_date,
      salesperson,
      item_name,
      account,
      quantity,
      rate,
      discount,
      amount,
      customer_notes,
      terms_conditions,
      user_id: req.userId,
    });

    res.status(201).json(newCreditNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all credit notes for the logged-in user
app.get('/api/creditnotes', authenticate, async (req, res) => {
  try {
    const creditNotes = await CreditNote.findAll({ where: { user_id: req.userId } });
    res.json(creditNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific credit note by ID for the logged-in user
app.get('/api/creditnotes/:id', authenticate, async (req, res) => {
  try {
    const creditNote = await CreditNote.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    });

    if (!creditNote) {
      return res.status(404).json({ message: 'Credit note not found' });
    }

    res.json(creditNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific credit note by ID for the logged-in user
app.put('/api/creditnotes/:id', authenticate, async (req, res) => {
  try {
    const {
      customer_name,
      credit_note_number,
      reference_number,
      credit_note_date,
      salesperson,
      item_name,
      account,
      quantity,
      rate,
      discount,
      amount,
      customer_notes,
      terms_conditions,
    } = req.body;

    const [updated] = await CreditNote.update(
      {
        customer_name,
        credit_note_number,
        reference_number,
        credit_note_date,
        salesperson,
        item_name,
        account,
        quantity,
        rate,
        discount,
        amount,
        customer_notes,
        terms_conditions,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.userId,
        },
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Credit note not found or not authorized' });
    }

    res.json({ message: 'Credit note updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific credit note by ID for the logged-in user
app.delete('/api/creditnotes/:id', authenticate, async (req, res) => {
  try {
    const deleted = await CreditNote.destroy({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Credit note not found or not authorized' });
    }

    res.json({ message: 'Credit note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Create a new vendor
app.post('/api/vendors', authenticate, async (req, res) => {
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

    const newVendor = await Vendor.create({
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
      user_id: req.userId,
    },
    {
      timestamps: false, // Disable timestamps explicitly for this query
    });

    res.status(201).json(newVendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all vendors for the logged-in user
app.get('/api/vendors', authenticate, async (req, res) => {
  try {
    // Verify if userId is available
    if (!req.userId) {
      return res.status(400).json({ error: 'User ID not provided' });
    }

    // Fetch vendors for the logged-in user
    const vendors = await Vendor.findAll({
      where: { user_id: req.userId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps if not needed
    });

    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error); // Log error details
    res.status(500).json({ error: error.message }); // Return error response
  }
});


// Get a specific vendor by ID for the logged-in user
app.get('/api/vendors/:id', authenticate, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific vendor by ID for the logged-in user
app.put('/api/vendors/:id', authenticate, async (req, res) => {
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
          user_id: req.userId,
        },
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Vendor not found or not authorized' });
    }

    res.json({ message: 'Vendor updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific vendor by ID for the logged-in user
app.delete('/api/vendors/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Vendor.destroy({
      where: {
        id: req.params.id,
        user_id: req.userId,
      },
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Vendor not found or not authorized' });
    }

    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Create a new purchase order
app.post('/api/purchaseorders', authenticate, async (req, res) => {
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
        user_id: req.userId,
      },
      {
        timestamps: false, // Disable timestamps explicitly for this query
      }
    );

    res.status(201).json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Get all purchase orders for the logged-in user
app.get('/api/purchaseorders', authenticate, async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.findAll({
      where: { user_id: req.userId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps
    });
    res.json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get a specific purchase order by ID for the logged-in user
app.get('/api/purchaseorders/:id', authenticate, async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findOne({
      where: { id: req.params.id, user_id: req.userId },
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps
    });

    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    res.json(purchaseOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update a purchase order by ID for the logged-in user
app.put('/api/purchaseorders/:id', authenticate, async (req, res) => {
  try {
    const [updated] = await PurchaseOrder.update(req.body, {
      where: { id: req.params.id, user_id: req.userId },
      fields: [
        'vendor_name',
        'delivery_address',
        'purchase_order_number',
        'reference_number',
        'date',
        'expected_delivery_date',
        'payment_terms',
        'shipment_preference',
        'item_name',
        'account',
        'quantity',
        'rate',
        'amount',
        'discount',
        'discount_account',
        'customer_notes',
        'terms_conditions',
        'user_id', // Explicitly list fields to be updated
      ],
    });

    if (!updated) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    res.json({ message: 'Purchase order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete a purchase order by ID for the logged-in user
app.delete('/api/purchaseorders/:id', authenticate, async (req, res) => {
  try {
    const deleted = await PurchaseOrder.destroy({ where: { id: req.params.id, user_id: req.userId } });
    if (!deleted) return res.status(404).json({ message: 'Purchase order not found or not authorized' });
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add a new bill payment
app.post('/api/billpayments', authenticate, async (req, res) => {
  try {
    const billPayment = await BillPayment.create({ ...req.body, user_id: req.userId });
    res.status(201).json(billPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all bill payments for the logged-in user
app.get('/api/billpayments', authenticate, async (req, res) => {
  try {
    const billPayments = await BillPayment.findAll({ where: { user_id: req.userId } });
    res.json(billPayments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get a specific bill payment by ID for the logged-in user
app.get('/api/billpayments/:id', authenticate, async (req, res) => {
  try {
    const billPayment = await BillPayment.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!billPayment) return res.status(404).json({ message: 'Bill payment not found' });
    res.json(billPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update a bill payment by ID for the logged-in user
app.put('/api/billpayments/:id', authenticate, async (req, res) => {
  try {
    const updated = await BillPayment.update(req.body, {
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!updated[0]) return res.status(404).json({ message: 'Bill payment not found or not authorized' });
    res.json({ message: 'Bill payment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete a bill payment by ID for the logged-in user
app.delete('/api/billpayments/:id', authenticate, async (req, res) => {
  try {
    const deleted = await BillPayment.destroy({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!deleted) return res.status(404).json({ message: 'Bill payment not found' });
    res.json({ message: 'Bill payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// Add a new vendor advance payment
app.post('/api/vendoradvances', authenticate, async (req, res) => {
  try {
    const vendorAdvance = await VendorAdvance.create({
      ...req.body,
      user_id: req.userId,
    });
    res.status(201).json(vendorAdvance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all vendor advance payments for the logged-in user
app.get('/api/vendoradvances', authenticate, async (req, res) => {
  try {
    const vendorAdvances = await VendorAdvance.findAll({
      where: { user_id: req.userId },
    });
    res.json(vendorAdvances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific vendor advance payment by ID for the logged-in user
app.get('/api/vendoradvances/:id', authenticate, async (req, res) => {
  try {
    const vendorAdvance = await VendorAdvance.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!vendorAdvance) {
      return res.status(404).json({ message: 'Vendor advance not found' });
    }
    res.json(vendorAdvance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a vendor advance payment by ID for the logged-in user
app.put('/api/vendoradvances/:id', authenticate, async (req, res) => {
  try {
    const [updated] = await VendorAdvance.update(req.body, {
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!updated) {
      return res.status(404).json({ message: 'Vendor advance not found or not authorized' });
    }
    res.json({ message: 'Vendor advance updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a vendor advance payment by ID for the logged-in user
app.delete('/api/vendoradvances/:id', authenticate, async (req, res) => {
  try {
    const deleted = await VendorAdvance.destroy({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Vendor advance not found' });
    }
    res.json({ message: 'Vendor advance deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Add a new vendor credit note
app.post('/api/vendorcredits', authenticate, async (req, res) => {
  try {
    const vendorCredit = await VendorCredit.create({
      ...req.body,
      user_id: req.userId,
    });
    res.status(201).json(vendorCredit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all vendor credit notes for the logged-in user
app.get('/api/vendorcredits', authenticate, async (req, res) => {
  try {
    const vendorCredits = await VendorCredit.findAll({
      where: { user_id: req.userId },
    });
    res.json(vendorCredits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific vendor credit note by ID for the logged-in user
app.get('/api/vendorcredits/:id', authenticate, async (req, res) => {
  try {
    const vendorCredit = await VendorCredit.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!vendorCredit) {
      return res.status(404).json({ message: 'Vendor credit note not found' });
    }
    res.json(vendorCredit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a vendor credit note by ID for the logged-in user
app.put('/api/vendorcredits/:id', authenticate, async (req, res) => {
  try {
    const [updated] = await VendorCredit.update(req.body, {
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!updated) {
      return res.status(404).json({ message: 'Vendor credit note not found or not authorized' });
    }
    res.json({ message: 'Vendor credit note updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a vendor credit note by ID for the logged-in user
app.delete('/api/vendorcredits/:id', authenticate, async (req, res) => {
  try {
    const deleted = await VendorCredit.destroy({
      where: { id: req.params.id, user_id: req.userId },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Vendor credit note not found' });
    }
    res.json({ message: 'Vendor credit note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Start server
app.listen(8084, () => console.log('Server running on http://localhost:8084'));

