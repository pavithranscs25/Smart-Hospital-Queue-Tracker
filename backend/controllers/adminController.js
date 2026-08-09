import { queueService } from '../services/queueService.js';

export const adminController = {
  getDashboardStats: (_req, res) => {
    try {
      const stats = queueService.getAdminStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch admin stats'
      });
    }
  }
};
