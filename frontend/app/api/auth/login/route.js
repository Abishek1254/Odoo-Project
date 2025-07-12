import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import { generateToken } from '../../../../lib/auth.js';
import { validateEmail, successResponse, errorResponse } from '../../../../lib/utils.js';

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        errorResponse('Email and password are required'),
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        errorResponse('Please enter a valid email address'),
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        errorResponse('Invalid email or password'),
        { status: 401 }
      );
    }

    // Check if user is banned
    if (user.isBanned) {
      return NextResponse.json(
        errorResponse('Your account has been banned. Please contact support.'),
        { status: 403 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        errorResponse('Invalid email or password'),
        { status: 401 }
      );
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = user.toJSON();

    return NextResponse.json(
      successResponse({ user: userResponse, token }, 'Login successful')
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
} 