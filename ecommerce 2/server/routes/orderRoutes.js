import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Order creation & customer routes
router.post('/', authenticateToken, createOrder);
router.get('/my', authenticateToken, getMyOrders);

// Admin-only order routes (MUST be defined before /:id wildcard)
router.get('/', authenticateToken, requireAdmin, getAllOrdersAdmin);
router.get('/admin/all', authenticateToken, requireAdmin, getAllOrdersAdmin);
router.put('/admin/:id/status', authenticateToken, requireAdmin, updateOrderStatusAdmin);

// Specific order by ID (customer or admin)
router.get('/:id', authenticateToken, getOrderById);

export default router;

