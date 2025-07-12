import { NextResponse } from "next/server"
import connectDB from "./../../../lib/db"
import User from "./../../../models/User"

export async function POST(req) {
  await connectDB()
  const body = await req.json()

  const { name, email, password, skills } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const newUser = new User({ name, email, password, skills })
    await newUser.save()

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
