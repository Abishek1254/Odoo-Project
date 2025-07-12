import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import { protectRoute } from '../../../../lib/auth.js';
import { successResponse, errorResponse } from '../../../../lib/utils.js';

// Get user by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;

    const user = await User.findById(id).select('-password -email');
    
    if (!user) {
      return NextResponse.json(
        errorResponse('User not found'),
        { status: 404 }
      );
    }

    if (!user.isPublic) {
      return NextResponse.json(
        errorResponse('User profile is private'),
        { status: 403 }
      );
    }

    return NextResponse.json(successResponse(user, 'User retrieved successfully'));

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const updateData = await request.json();

    // Remove sensitive fields that shouldn't be updated directly
    const { password, email, isAdmin, isBanned, ...safeUpdateData } = updateData;

    const user = await User.findByIdAndUpdate(
      id,
      { ...safeUpdateData, lastActive: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        errorResponse('User not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(user, 'User updated successfully'));

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

// Delete user (admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return NextResponse.json(
        errorResponse('User not found'),
        { status: 404 }
      );
    }

    return NextResponse.json(successResponse(null, 'User deleted successfully'));

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
} 