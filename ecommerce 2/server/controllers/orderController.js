import { db } from '../database/db.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, discountAmount = 0 } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Cannot process empty order.'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required.'
      });
    }

    // Calculate subtotal in INR (₹)
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity, 10)), 0);
    const shipping = subtotal > 40000 ? 0 : 499; // Free shipping over ₹40,000, else ₹499
    const tax = +(subtotal * 0.18).toFixed(2); // 18% GST standard
    const total = +(subtotal - parseFloat(discountAmount || 0) + shipping + tax).toFixed(2);

    const order = await db.createOrder({
      userId: req.user.id,
      items,
      totalAmount: total,
      discountAmount,
      shippingAmount: shipping,
      taxAmount: tax,
      paymentMethod: paymentMethod || 'Simulated AI Pay (UPI/Card)',
      shippingAddress
    });

    return res.status(201).json({
      success: true,
      message: 'Order created and payment authorized successfully.',
      order
    });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await db.getOrdersByUserId(req.user.id);
    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await db.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Security check: ensure user owns this order unless user is admin
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this order.'
      });
    }

    return res.json({
      success: true,
      order
    });
  } catch (err) {
    next(err);
  }
};

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await db.getAllOrders();
    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await db.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    return res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      order: updated
    });
  } catch (err) {
    next(err);
  }
};

