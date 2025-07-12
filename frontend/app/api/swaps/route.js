import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Swap from '../../../models/Swap.js';
import Notification from '../../../models/Notification.js';
import User from '../../../models/User.js';
import { protectRoute } from '../../../lib/auth.js';
import { successResponse, errorResponse } from '../../../lib/utils.js';

// Create a new swap request
export async function POST(request) {
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

    const user = await User.findById(userId);
    if (!user || user.isBanned) {
      return NextResponse.json(
        errorResponse('User not found or banned'),
        { status: 401 }
      );
    }

    const { recipientId, requestedSkill, offeredSkill, message, scheduledDate } = await request.json();

    // Validation
    if (!recipientId || !requestedSkill || !offeredSkill) {
      return NextResponse.json(
        errorResponse('Recipient, requested skill, and offered skill are required'),
        { status: 400 }
      );
    }

    // Check if recipient exists and is not the same as requester
    if (recipientId === userId) {
      return NextResponse.json(
        errorResponse('Cannot send swap request to yourself'),
        { status: 400 }
      );
    }

    const recipient = await User.findById(recipientId);
    if (!recipient || recipient.isBanned) {
      return NextResponse.json(
        errorResponse('Recipient not found or unavailable'),
        { status: 400 }
      );
    }

    // Create swap request
    const swap = new Swap({
      requester: userId,
      recipient: recipientId,
      requestedSkill: {
        name: requestedSkill.name,
        description: requestedSkill.description || ''
      },
      offeredSkill: {
        name: offeredSkill.name,
        description: offeredSkill.description || ''
      },
      message: message || '',
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      status: 'pending'
    });

    await swap.save();

    // Create notification for recipient
    const notification = new Notification({
      recipient: recipientId,
      sender: userId,
      type: 'swap_request',
      title: 'New Swap Request',
      message: `${user.name} wants to swap ${offeredSkill.name} for ${requestedSkill.name}`,
      relatedSwap: swap._id,
      isRead: false
    });

    await notification.save();

    // Update user's pending swaps count
    await User.findByIdAndUpdate(userId, {
      $inc: { 'totalSwaps.pending': 1 }
    });

    return NextResponse.json(
      successResponse({ swap }, 'Swap request sent successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Create swap error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

// Get swaps for the authenticated user
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
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Build query
    let query = {
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const swaps = await Swap.find(query)
      .populate('requester', 'name email profilePhoto')
      .populate('recipient', 'name email profilePhoto')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Swap.countDocuments(query);

    const response = {
      swaps,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    return NextResponse.json(successResponse(response, 'Swaps retrieved successfully'));

  } catch (error) {
    console.error('Get swaps error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
} 