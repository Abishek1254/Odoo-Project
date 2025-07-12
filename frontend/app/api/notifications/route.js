import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Notification from '../../../models/Notification.js';
import { successResponse, errorResponse } from '../../../lib/utils.js';

// Get notifications for a user
export async function GET(request) {
  try {
    await connectDB();
    
    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        errorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const { userId } = await import('../../../lib/auth.js').then(m => m.verifyToken(token));
    if (!userId) {
      return NextResponse.json(
        errorResponse('Invalid token'),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // Build query
    let query = { 
      recipient: userId, 
      isDeleted: false 
    };

    if (unreadOnly) {
      query.isRead = false;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const notifications = await Notification.find(query)
      .populate('sender', 'name profilePhoto')
      .populate('relatedSwap')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count
    const total = await Notification.countDocuments(query);

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: false
    });

    const response = {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    return NextResponse.json(successResponse(response, 'Notifications retrieved successfully'));

  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

// Mark notifications as read
export async function PUT(request) {
  try {
    await connectDB();
    
    const { userId, notificationIds, markAll } = await request.json();

    if (!userId) {
      return NextResponse.json(
        errorResponse('User ID is required'),
        { status: 400 }
      );
    }

    let updateQuery = { recipient: userId, isDeleted: false };

    if (!markAll && notificationIds && notificationIds.length > 0) {
      updateQuery._id = { $in: notificationIds };
    }

    const result = await Notification.updateMany(
      updateQuery,
      { isRead: true }
    );

    return NextResponse.json(
      successResponse({ updatedCount: result.modifiedCount }, 'Notifications marked as read')
    );

  } catch (error) {
    console.error('Mark notifications read error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

// Delete notifications
export async function DELETE(request) {
  try {
    await connectDB();
    
    const { userId, notificationIds, deleteAll } = await request.json();

    if (!userId) {
      return NextResponse.json(
        errorResponse('User ID is required'),
        { status: 400 }
      );
    }

    let deleteQuery = { recipient: userId };

    if (!deleteAll && notificationIds && notificationIds.length > 0) {
      deleteQuery._id = { $in: notificationIds };
    }

    const result = await Notification.updateMany(
      deleteQuery,
      { isDeleted: true }
    );

    return NextResponse.json(
      successResponse({ deletedCount: result.modifiedCount }, 'Notifications deleted successfully')
    );

  } catch (error) {
    console.error('Delete notifications error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
} 