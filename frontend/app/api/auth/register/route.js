import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import { generateToken } from '../../../../lib/auth.js';
import { validateEmail, validatePassword, successResponse, errorResponse } from '../../../../lib/utils.js';

export async function POST(request) {
  try {
    await connectDB();
    
    const { name, email, password, location } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        errorResponse('Name, email, and password are required'),
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        errorResponse('Please enter a valid email address'),
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        errorResponse('Password must be at least 6 characters long'),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        errorResponse('User with this email already exists'),
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      location: location || ''
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = user.toJSON();

    return NextResponse.json(
      successResponse({ user: userResponse, token }, 'User registered successfully'),
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      errorResponse('Internal server error', 500),
      { status: 500 }
    );
  }
} 