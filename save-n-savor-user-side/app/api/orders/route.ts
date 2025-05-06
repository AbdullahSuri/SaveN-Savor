import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongoose"
import User from "@/models/user"
import mongoose from "mongoose"
import { v4 as uuidv4 } from "uuid"

// Improve error handling and logging in the POST endpoint
export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Received order request:", body)

    const { userId, items, subtotal, serviceFee, total, pickupAddress, pickupTime, paymentMethod } = body

    if (!userId || !items || !subtotal || !total || !pickupAddress || !pickupTime) {
      console.error("Missing required fields:", { userId, items, subtotal, total, pickupAddress, pickupTime })
      return NextResponse.json({ error: "Missing required order information" }, { status: 400 })
    }

    await dbConnect()
    console.log("Connected to database")

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId)
      return NextResponse.json({ error: "Invalid userId format" }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      console.error("User not found:", userId)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    console.log("Found user:", user._id)

    // Calculate environmental impact (simplified calculation)
    const foodSaved = items.reduce((total, item) => total + item.quantity * 0.5, 0) // 0.5kg per item
    const co2Saved = foodSaved * 2.5 // 2.5kg CO2 saved per kg of food

    // Create a new order
    const orderId = `ORD-${uuidv4().substring(0, 8)}`
    const newOrder = {
      orderId,
      date: new Date(),
      items,
      subtotal,
      serviceFee: serviceFee || 2.0,
      total,
      status: "confirmed",
      pickupAddress,
      pickupTime,
      paymentMethod,
      impact: {
        foodSaved,
        co2Saved,
      },
    }

    console.log("Created new order:", newOrder)

    // Check if user.orders exists, if not initialize it
    if (!user.orders) {
      user.orders = []
    }

    // Add the order to the user's orders array
    user.orders.push(newOrder)
    
    try {
      await user.save()
      console.log("Order saved to user successfully")
    } catch (saveError) {
      console.error("Error saving user with new order:", saveError)
      
      // Try an alternative approach if the first save fails
      const updateResult = await User.updateOne(
        { _id: userId },
        { $push: { orders: newOrder } }
      )
      
      console.log("Update result:", updateResult)
      
      if (updateResult.modifiedCount === 0) {
        throw new Error("Failed to save order to user")
      }
    }

    return NextResponse.json({
      message: "Order placed successfully",
      order: newOrder,
    })
  } catch (error) {
    console.error("Error placing order:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: (error as Error).message,
        stack: (error as Error).stack,
      },
      { status: 500 },
    )
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId)
      return NextResponse.json({ error: "Invalid userId format" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if orders array exists
    if (!user.orders || !Array.isArray(user.orders)) {
      console.log("User has no orders array, returning empty array")
      return NextResponse.json({ orders: [] })
    }

    // Sort orders by date (newest first)
    const orders = user.orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: (error as Error).message,
      stack: (error as Error).stack,
    }, { status: 500 })
  }
}
