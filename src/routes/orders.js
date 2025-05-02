const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Customer routes
router.get('/myorders', getMyOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);
router.delete('/:id', deleteOrder);

// Admin routes
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id', authorize('admin'), updateOrderStatus);

module.exports = router;