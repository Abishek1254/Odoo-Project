import { NextResponse } from "next/server"
import connectDB from "./../../../lib/db"
import User from "./../../../models/User"

export async function POST(req) {
  await connectDB()
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  
  return NextResponse.json({
    message: 'Login successful',
    user: { name: user.name, email: user.email },
  }, { status: 200 })
}
