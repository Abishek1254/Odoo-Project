import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Swap from '../../../../models/Swap.js';
import Notification from '../../../../models/Notification.js';
import User from '../../../../models/User.js';
import { successResponse, errorResponse } from '../../../../lib/utils.js';

// Update swap status (accept/reject/complete)
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const { status, feedback } = await request.json();

    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        errorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const { userId } = await import('../../../../lib/auth.js').then(m => m.verifyToken(token));
    if (!userId) {
      return NextResponse.json(
        errorResponse('Invalid token'),
        { status: 401 }
      );
    }

    // Find the swap
    const swap = await Swap.findById(id)
      .populate('requester', 'name email')
      .populate('recipient', 'name email');

    if (!swap) {
      return NextResponse.json(
        errorResponse('Swap not found'),
        { status: 404 }
      );
    }

    // Check if user is authorized to update this swap
    if (swap.recipient._id.toString() !== userId && swap.requester._id.toString() !== userId) {
      return NextResponse.json(
        errorResponse('Not authorized to update this swap'),
        { status: 403 }
      );
    }

    // Validate status transition
    const validTransitions = {
      pending: ['accepted', 'rejected'],
      accepted: ['completed', 'cancelled'],
      completed: [],
      rejected: [],
      cancelled: []
    };

    if (!validTransitions[swap.status].includes(status)) {
      return NextResponse.json(
        errorResponse(`Cannot change status from ${swap.status} to ${status}`),
        { status: 400 }
      );
    }

    // Update swap status
    swap.status = status;
    
    if (status === 'completed') {
      swap.completedDate = new Date();
      if (feedback) {
        swap.feedback = feedback;
      }
    }

    await swap.save();

    // Create notification based on status change
    let notificationData = null;

    if (status === 'accepted') {
      notificationData = {
        recipient: swap.requester._id,
        sender: swap.recipient._id,
        type: 'swap_accepted',
        title: 'Swap Accepted',
        message: `${swap.recipient.name} accepted your swap request for ${swap.requestedSkill.name}`,
        relatedSwap: swap._id,
        isRead: false
      };

      // Update user stats
      await User.findByIdAndUpdate(swap.requester._id, {
        $inc: { 'totalSwaps.pending': -1 }
      });
      await User.findByIdAndUpdate(swap.recipient._id, {
        $inc: { 'totalSwaps.pending': -1 }
      });
    } else if (status === 'rejected') {
      notificationData = {
        recipient: swap.requester._id,
        sender: swap.recipient._id,
        type: 'swap_rejected',
        title: 'Swap Rejected',
        message: `${swap.recipient.name} rejected your swap request for ${swap.requestedSkill.name}`,
        relatedSwap: swap._id,
        isRead: false
      };

      // Update user stats
      await User.findByIdAndUpdate(swap.requester._id, {
        $inc: { 'totalSwaps.pending': -1 }
      });
      await User.findByIdAndUpdate(swap.recipient._id, {
        $inc: { 'totalSwaps.pending': -1 }
      });
    } else if (status === 'completed') {
      notificationData = {
        recipient: swap.requester._id,
        sender: swap.recipient._id,
        type: 'swap_completed',
        title: 'Swap Completed',
        message: `Your swap with ${swap.recipient.name} has been completed successfully`,
        relatedSwap: swap._id,
        isRead: false
      };

      // Update user stats
      await User.findByIdAndUpdate(swap.requester._id, {
        $inc: { 'totalSwaps.completed': 1 }
      });
      await User.findByIdAndUpdate(swap.recipient._id, {
        $inc: { 'totalSwaps.completed': 1 }
      });
    }

    if (notificationData) {
      const notification = new Notification(notificationData);
      await notification.save();
    }

    return NextResponse.json(
      successResponse({ swap }, `Swap ${status} successfully`)
    );

  } catch (error) {
    console.error('Update swap error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

// Get specific swap details
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;

    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        errorResponse('Authentication required'),
        { status: 401 }
      );
    }

    const { userId } = await import('../../../../lib/auth.js').then(m => m.verifyToken(token));
    if (!userId) {
      return NextResponse.json(
        errorResponse('Invalid token'),
        { status: 401 }
      );
    }

    const swap = await Swap.findById(id)
      .populate('requester', 'name email profilePhoto')
      .populate('recipient', 'name email profilePhoto');

    if (!swap) {
      return NextResponse.json(
        errorResponse('Swap not found'),
        { status: 404 }
      );
    }

    // Check if user is authorized to view this swap
    if (swap.recipient._id.toString() !== userId && swap.requester._id.toString() !== userId) {
      return NextResponse.json(
        errorResponse('Not authorized to view this swap'),
        { status: 403 }
      );
    }

    return NextResponse.json(
      successResponse({ swap }, 'Swap retrieved successfully')
    );

  } catch (error) {
    console.error('Get swap error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

// Delete swap (only if pending and user is requester)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const { userId } = await request.json();

    const swap = await Swap.findById(id);
    
    if (!swap) {
      return NextResponse.json(
        errorResponse('Swap not found'),
        { status: 404 }
      );
    }

    // Only requester can delete pending swaps
    if (swap.requester.toString() !== userId) {
      return NextResponse.json(
        errorResponse('Only the requester can delete this swap'),
        { status: 403 }
      );
    }

    if (swap.status !== 'pending') {
      return NextResponse.json(
        errorResponse('Only pending swaps can be deleted'),
        { status: 400 }
      );
    }

    await Swap.findByIdAndDelete(id);

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'totalSwaps.pending': -1 }
    });

    return NextResponse.json(successResponse(null, 'Swap deleted successfully'));

  } catch (error) {
    console.error('Delete swap error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
} 