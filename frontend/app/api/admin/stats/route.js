import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import Swap from '../../../../models/Swap.js';
import Notification from '../../../../models/Notification.js';
import { successResponse, errorResponse } from '../../../../lib/utils.js';

// Get platform statistics
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, week, month, year

    // Calculate date range
    let dateFilter = {};
    const now = new Date();
    
    if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'year') {
      dateFilter = { createdAt: { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } };
    }

    // User statistics
    const userStats = await User.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          verifiedUsers: { $sum: { $cond: ['$isVerified', 1, 0] } },
          bannedUsers: { $sum: { $cond: ['$isBanned', 1, 0] } },
          adminUsers: { $sum: { $cond: ['$isAdmin', 1, 0] } },
          totalCompletedSwaps: { $sum: '$totalSwaps.completed' },
          totalPendingSwaps: { $sum: '$totalSwaps.pending' }
        }
      }
    ]);

    // Swap statistics
    const swapStats = await Swap.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalSwaps: { $sum: 1 },
          pendingSwaps: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          acceptedSwaps: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
          completedSwaps: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          rejectedSwaps: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          cancelledSwaps: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
        }
      }
    ]);

    // Notification statistics
    const notificationStats = await Notification.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalNotifications: { $sum: 1 },
          unreadNotifications: { $sum: { $cond: ['$isRead', 0, 1] } },
          readNotifications: { $sum: { $cond: ['$isRead', 1, 0] } }
        }
      }
    ]);

    // Monthly user growth (last 12 months)
    const monthlyGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getTime() - 12 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top skills offered
    const topSkillsOffered = await User.aggregate([
      { $unwind: '$skillsOffered' },
      {
        $group: {
          _id: '$skillsOffered.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Top skills wanted
    const topSkillsWanted = await User.aggregate([
      { $unwind: '$skillsWanted' },
      {
        $group: {
          _id: '$skillsWanted.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const stats = {
      users: userStats[0] || {
        totalUsers: 0,
        verifiedUsers: 0,
        bannedUsers: 0,
        adminUsers: 0,
        totalCompletedSwaps: 0,
        totalPendingSwaps: 0
      },
      swaps: swapStats[0] || {
        totalSwaps: 0,
        pendingSwaps: 0,
        acceptedSwaps: 0,
        completedSwaps: 0,
        rejectedSwaps: 0,
        cancelledSwaps: 0
      },
      notifications: notificationStats[0] || {
        totalNotifications: 0,
        unreadNotifications: 0,
        readNotifications: 0
      },
      analytics: {
        monthlyGrowth,
        topSkillsOffered,
        topSkillsWanted
      }
    };

    return NextResponse.json(successResponse(stats, 'Statistics retrieved successfully'));

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
} 