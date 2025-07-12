import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 