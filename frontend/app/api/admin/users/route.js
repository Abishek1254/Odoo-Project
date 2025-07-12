import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import Swap from '../../../../models/Swap.js';
import { successResponse, errorResponse } from '../../../../lib/utils.js';

// Get all users (admin only)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'active') {
      query.isBanned = false;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count
    const total = await User.countDocuments(query);

    // Get statistics
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          bannedUsers: { $sum: { $cond: ['$isBanned', 1, 0] } },
          verifiedUsers: { $sum: { $cond: ['$isVerified', 1, 0] } },
          adminUsers: { $sum: { $cond: ['$isAdmin', 1, 0] } }
        }
      }
    ]);

    const response = {
      users,
      stats: stats[0] || {
        totalUsers: 0,
        bannedUsers: 0,
        verifiedUsers: 0,
        adminUsers: 0
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    return NextResponse.json(successResponse(response, 'Users retrieved successfully'));

  } catch (error) {
    console.error('Admin get users error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

// Ban/Unban user
export async function PUT(request) {
  try {
    await connectDB();
    
    const { userId, action, reason } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        errorResponse('User ID and action are required'),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        errorResponse('User not found'),
        { status: 404 }
      );
    }

    let updateData = {};

    if (action === 'ban') {
      updateData = { 
        isBanned: true,
        banReason: reason || 'Violation of platform policies'
      };
    } else if (action === 'unban') {
      updateData = { 
        isBanned: false,
        banReason: null
      };
    } else if (action === 'verify') {
      updateData = { isVerified: true };
    } else if (action === 'unverify') {
      updateData = { isVerified: false };
    } else {
      return NextResponse.json(
        errorResponse('Invalid action'),
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    return NextResponse.json(
      successResponse(updatedUser, `User ${action}ed successfully`)
    );

  } catch (error) {
    console.error('Admin update user error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
} 