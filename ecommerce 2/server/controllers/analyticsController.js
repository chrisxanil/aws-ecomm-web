import { db } from '../database/db.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const summary = await db.getAnalyticsSummary();
    const recentOrders = await db.getAllOrders();

    return res.json({
      success: true,
      analytics: {
        ...summary,
        recentOrders: recentOrders.slice(0, 5)
      }
    });
  } catch (err) {
    next(err);
  }
};

