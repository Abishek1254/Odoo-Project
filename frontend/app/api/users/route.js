import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import { protectRoute } from '../../../lib/auth.js';
import { createSearchQuery, paginateResults, successResponse, errorResponse } from '../../../lib/utils.js';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const availability = searchParams.get('availability') || '';
    const skillLevel = searchParams.get('skillLevel') || '';
    const location = searchParams.get('location') || '';

    // Build query
    let query = { isPublic: true, isBanned: false };

    // Add search functionality
    if (search) {
      const searchQuery = createSearchQuery(search, ['name', 'location', 'skillsOffered.name', 'skillsWanted.name']);
      query = { ...query, ...searchQuery };
    }

    // Add availability filter
    if (availability) {
      query.availability = availability;
    }

    // Add skill level filter
    if (skillLevel) {
      query['skillsOffered.level'] = skillLevel;
    }

    // Add location filter
    if (location) {
      if (location === 'remote') {
        query.location = { $regex: /remote/i };
      } else if (location === 'local') {
        query.location = { $not: /remote/i };
      }
    }

    // Pagination
    const { skip, limit: pageLimit } = paginateResults(page, limit);

    // Execute query
    const users = await User.find(query)
      .select('-password -email')
      .skip(skip)
      .limit(pageLimit)
      .sort({ lastActive: -1 });

    // Get total count for pagination
    const total = await User.countDocuments(query);

    const response = {
      users,
      pagination: {
        page,
        limit: pageLimit,
        total,
        pages: Math.ceil(total / pageLimit)
      }
    };

    return NextResponse.json(successResponse(response, 'Users retrieved successfully'));

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
}

// Create new user (admin only)
export async function POST(request) {
  try {
    await connectDB();
    
    // This would typically be protected by admin middleware
    // For now, we'll use the registration endpoint for user creation
    
    return NextResponse.json(
      errorResponse('Use /api/auth/register to create new users'),
      { status: 405 }
    );

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
} 