const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const AuthController = require('../controllers/admin/AuthController');
const InventoryController = require('../controllers/admin/InventoryController');
const CompositeItemController = require('../controllers/admin/CompositeItemController');
const ItemGroupController = require('../controllers/admin/ItemGroupController');
const PriceListController = require('../controllers/admin/PriceListController');
const ShipmentController = require('../controllers/admin/ShipmentController');
const PaymentReceivedController = require('../controllers/admin/PaymentReceivedController');
const PurchaseReceiveController = require('../controllers/admin/PurchaseReceiveController');
const PaymentsMadeController = require('../controllers/admin/PaymentsMadeController');
const SalesReturnController = require('../controllers/admin/SalesReturnController');
const CustomerController = require('../controllers/admin/CustomerController');
const BillController = require('../controllers/admin/BillController');
const ChallanController = require('../controllers/admin/ChallanController');
const ItemController = require('../controllers/admin/ItemController');
const AdjustmentController = require('../controllers/admin/AdjustmentController');
const InvoiceController = require('../controllers/admin/InvoiceController');
const RetainerInvoiceController = require('../controllers/admin/RetainerInvoiceController');
const SalesOrderController = require('../controllers/admin/SalesOrderController');
const CreditNoteController = require('../controllers/admin/CreditNoteController');
const VendorController = require('../controllers/admin/VendorController');
const PurchaseOrderController = require('../controllers/admin/PurchaseOrderController');
const BillPaymentController = require('../controllers/admin/BillPaymentController');
const VendorAdvanceController = require('../controllers/admin/VendorAdvanceController');
const VendorCreditController = require('../controllers/admin/VendorCreditController');

// Auth routes ✅
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/user', authenticateToken, AuthController.getUser);
router.post('/forgot-password', AuthController.forgotPassword);

// Inventory routes
router.post('/inventory', authenticateToken, InventoryController.createInventory);
router.get('/inventory', authenticateToken, InventoryController.getAllInventory);
router.get('/inventory/:id', authenticateToken, InventoryController.getInventoryById);
router.put('/inventory/:id', authenticateToken, InventoryController.updateInventory);
router.delete('/inventory/:id', authenticateToken, InventoryController.deleteInventory);

// Composite Items routes ✅
router.post('/composite-items', authenticateToken, CompositeItemController.createCompositeItem);
router.get('/composite-items', authenticateToken, CompositeItemController.getAllCompositeItems);
router.get('/composite-items/:id', authenticateToken, CompositeItemController.getCompositeItemById);
router.put('/composite-items/:id', authenticateToken, CompositeItemController.updateCompositeItem);
router.delete('/composite-items/:id', authenticateToken, CompositeItemController.deleteCompositeItem);

// Item Groups routes ✅
router.post('/item-groups', authenticateToken, upload.single('image'), ItemGroupController.createItemGroup);
router.get('/item-groups', authenticateToken, ItemGroupController.getAllItemGroups);
router.get('/item-groups/:id', authenticateToken, ItemGroupController.getItemGroupById);
router.put('/item-groups/:id', authenticateToken, ItemGroupController.updateItemGroup);
router.put('/item-groups/:id/image', authenticateToken, upload.single('image'), ItemGroupController.updateItemGroupWithImage);
router.delete('/item-groups/:id', authenticateToken, ItemGroupController.deleteItemGroup);

// PriceList routes ✅
router.post('/price-lists', authenticateToken, PriceListController.createPriceList);
router.get('/price-lists', authenticateToken, PriceListController.getAllPriceLists);
router.get('/price-lists/:id', authenticateToken, PriceListController.getPriceListById);
router.put('/price-lists/:id', authenticateToken, PriceListController.updatePriceList);
router.delete('/price-lists/:id', authenticateToken, PriceListController.deletePriceList);

// Shipment routes ✅
router.post('/shipments', authenticateToken, ShipmentController.createShipment);
router.get('/shipments', authenticateToken, ShipmentController.getAllShipments);
router.get('/shipments/:id', authenticateToken, ShipmentController.getShipmentById);
router.put('/shipments/:id', authenticateToken, ShipmentController.updateShipment);
router.delete('/shipments/:id', authenticateToken, ShipmentController.deleteShipment);

// Payment Received routes ✅
router.post('/payments-received', authenticateToken, PaymentReceivedController.createPaymentReceived);
router.get('/payments-received', authenticateToken, PaymentReceivedController.getAllPaymentsReceived);
router.get('/payments-received/:id', authenticateToken, PaymentReceivedController.getPaymentReceivedById);
router.put('/payments-received/:id', authenticateToken, PaymentReceivedController.updatePaymentReceived);
router.delete('/payments-received/:id', authenticateToken, PaymentReceivedController.deletePaymentReceived);

// Purchase Receive routes ✅
router.post('/purchase-receives', authenticateToken, PurchaseReceiveController.createPurchaseReceive);
router.get('/purchase-receives', authenticateToken, PurchaseReceiveController.getAllPurchaseReceives);
router.get('/purchase-receives/:id', authenticateToken, PurchaseReceiveController.getPurchaseReceiveById);
router.put('/purchase-receives/:id', authenticateToken, PurchaseReceiveController.updatePurchaseReceive);
router.delete('/purchase-receives/:id', authenticateToken, PurchaseReceiveController.deletePurchaseReceive);

// Payments Made routes ✅
router.post('/payments-made', authenticateToken, PaymentsMadeController.createPaymentMade);
router.get('/payments-made', authenticateToken, PaymentsMadeController.getAllPaymentsMade);
router.get('/payments-made/:id', authenticateToken, PaymentsMadeController.getPaymentMadeById);
router.put('/payments-made/:id', authenticateToken, PaymentsMadeController.updatePaymentMade);
router.delete('/payments-made/:id', authenticateToken, PaymentsMadeController.deletePaymentMade);

// Sales Return routes ✅
router.post('/sales-returns', authenticateToken, SalesReturnController.createSalesReturn);
router.get('/sales-returns', authenticateToken, SalesReturnController.getAllSalesReturns);
router.get('/sales-returns/:id', authenticateToken, SalesReturnController.getSalesReturnById);
router.put('/sales-returns/:id', authenticateToken, SalesReturnController.updateSalesReturn);
router.delete('/sales-returns/:id', authenticateToken, SalesReturnController.deleteSalesReturn);

// Customer routes ✅
router.post('/customers', authenticateToken, CustomerController.createCustomer);
router.get('/customers', authenticateToken, CustomerController.getAllCustomers);
router.get('/customers/:id', authenticateToken, CustomerController.getCustomerById);
router.put('/customers/:id', authenticateToken, CustomerController.updateCustomer);
router.delete('/customers/:id', authenticateToken, CustomerController.deleteCustomer);

// Bill routes ✅
router.post('/bills', authenticateToken, BillController.createBill);
router.get('/bills', authenticateToken, BillController.getAllBills);
router.get('/bills/:id', authenticateToken, BillController.getBillById);
router.put('/bills/:id', authenticateToken, BillController.updateBill);
router.delete('/bills/:id', authenticateToken, BillController.deleteBill);

// Challan routes ✅
router.post('/challans', authenticateToken, ChallanController.createChallan);
router.get('/challans', authenticateToken, ChallanController.getAllChallans);
router.get('/challans/:id', authenticateToken, ChallanController.getChallanById);
router.put('/challans/:id', authenticateToken, ChallanController.updateChallan);
router.delete('/challans/:id', authenticateToken, ChallanController.deleteChallan);

// Item routes ✅
router.post('/items', authenticateToken, ItemController.createItem);
router.get('/items', authenticateToken, ItemController.getAllItems);
router.get('/items/:id', authenticateToken, ItemController.getItemById);
router.put('/items/:id', authenticateToken, ItemController.updateItem);
router.delete('/items/:id', authenticateToken, ItemController.deleteItem);

// Adjustment routes ✅
router.post('/adjustments', authenticateToken, AdjustmentController.createAdjustment);
router.get('/adjustments', authenticateToken, AdjustmentController.getAllAdjustments);
router.get('/adjustments/:id', authenticateToken, AdjustmentController.getAdjustmentById);
router.put('/adjustments/:id', authenticateToken, AdjustmentController.updateAdjustment);
router.delete('/adjustments/:id', authenticateToken, AdjustmentController.deleteAdjustment);

// Invoice routes ✅
router.post('/invoices', authenticateToken, InvoiceController.createInvoice);
router.get('/invoices', authenticateToken, InvoiceController.getAllInvoices);
router.get('/invoices/:id', authenticateToken, InvoiceController.getInvoiceById);
router.put('/invoices/:id', authenticateToken, InvoiceController.updateInvoice);
router.delete('/invoices/:id', authenticateToken, InvoiceController.deleteInvoice);

// Retainer Invoice routes ✅
router.post('/retainer-invoices', authenticateToken, RetainerInvoiceController.createRetainerInvoice);
router.get('/retainer-invoices', authenticateToken, RetainerInvoiceController.getAllRetainerInvoices);
router.get('/retainer-invoices/:id', authenticateToken, RetainerInvoiceController.getRetainerInvoiceById);
router.put('/retainer-invoices/:id', authenticateToken, RetainerInvoiceController.updateRetainerInvoice);
router.delete('/retainer-invoices/:id', authenticateToken, RetainerInvoiceController.deleteRetainerInvoice);

// Sales Order routes ✅
router.post('/sales-orders', authenticateToken, SalesOrderController.createSalesOrder);
router.get('/sales-orders', authenticateToken, SalesOrderController.getAllSalesOrders);
router.get('/sales-orders/:id', authenticateToken, SalesOrderController.getSalesOrderById);
router.put('/sales-orders/:id', authenticateToken, SalesOrderController.updateSalesOrder);
router.delete('/sales-orders/:id', authenticateToken, SalesOrderController.deleteSalesOrder);

// Credit Note routes ✅
router.post('/credit-notes', authenticateToken, CreditNoteController.createCreditNote);
router.get('/credit-notes', authenticateToken, CreditNoteController.getAllCreditNotes);
router.get('/credit-notes/:id', authenticateToken, CreditNoteController.getCreditNoteById);
router.put('/credit-notes/:id', authenticateToken, CreditNoteController.updateCreditNote);
router.delete('/credit-notes/:id', authenticateToken, CreditNoteController.deleteCreditNote);

// Vendor routes ✅
router.post('/vendors', authenticateToken, VendorController.createVendor);
router.get('/vendors', authenticateToken, VendorController.getAllVendors);
router.get('/vendors/:id', authenticateToken, VendorController.getVendorById);
router.put('/vendors/:id', authenticateToken, VendorController.updateVendor);
router.delete('/vendors/:id', authenticateToken, VendorController.deleteVendor);

// Purchase Order routes ✅
router.post('/purchase-orders', authenticateToken, PurchaseOrderController.createPurchaseOrder);
router.get('/purchase-orders', authenticateToken, PurchaseOrderController.getAllPurchaseOrders);
router.get('/purchase-orders/:id', authenticateToken, PurchaseOrderController.getPurchaseOrderById);
router.put('/purchase-orders/:id', authenticateToken, PurchaseOrderController.updatePurchaseOrder);
router.delete('/purchase-orders/:id', authenticateToken, PurchaseOrderController.deletePurchaseOrder);

// Bill Payment routes ✅
router.post('/bill-payments', authenticateToken, BillPaymentController.createBillPayment);
router.get('/bill-payments', authenticateToken, BillPaymentController.getAllBillPayments);
router.get('/bill-payments/:id', authenticateToken, BillPaymentController.getBillPaymentById);
router.put('/bill-payments/:id', authenticateToken, BillPaymentController.updateBillPayment);
router.delete('/bill-payments/:id', authenticateToken, BillPaymentController.deleteBillPayment);

// Vendor Advance routes ✅
router.post('/vendor-advances', authenticateToken, VendorAdvanceController.createVendorAdvance);
router.get('/vendor-advances', authenticateToken, VendorAdvanceController.getAllVendorAdvances);
router.get('/vendor-advances/:id', authenticateToken, VendorAdvanceController.getVendorAdvanceById);
router.put('/vendor-advances/:id', authenticateToken, VendorAdvanceController.updateVendorAdvance);
router.delete('/vendor-advances/:id', authenticateToken, VendorAdvanceController.deleteVendorAdvance);

// Vendor Credit routes ✅
router.post('/vendor-credits', authenticateToken, VendorCreditController.createVendorCredit);
router.get('/vendor-credits', authenticateToken, VendorCreditController.getAllVendorCredits);
router.get('/vendor-credits/:id', authenticateToken, VendorCreditController.getVendorCreditById);
router.put('/vendor-credits/:id', authenticateToken, VendorCreditController.updateVendorCredit);
router.delete('/vendor-credits/:id', authenticateToken, VendorCreditController.deleteVendorCredit);

module.exports = router;