import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongoose"
import mongoose from "mongoose"

// Reference the existing FoodItem model
const FoodItem = mongoose.models.FoodItem

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id) && id.length !== 24) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    await dbConnect()

    const foodItem = await FoodItem.findById(id)

    if (!foodItem) {
      return NextResponse.json({ error: "Food item not found" }, { status: 404 })
    }

    // Calculate a random distance between 0.5 and 5 km
    const distance = (Math.random() * 4.5 + 0.5).toFixed(1) + " km"

    // Calculate a random rating between 3.5 and 5.0
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1)

    // Generate random coordinates near Dubai (for map display)
    const lat = 25.2 + (Math.random() * 0.1 - 0.05)
    const lng = 55.27 + (Math.random() * 0.1 - 0.05)

    // Handle the new image format (Base64)
    let imageUrl = `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(foodItem.name)}`
    if (foodItem.image && foodItem.image.data) {
      // Create a data URL from the Base64 data and content type
      imageUrl = `data:${foodItem.image.contentType};base64,${foodItem.image.data}`
    }

    // Transform the data to match the format expected by the UI
    const transformedItem = {
      id: foodItem._id.toString(),
      name: foodItem.name,
      vendor: foodItem.vendor.name,
      vendorId: foodItem.vendor.id,
      originalPrice: foodItem.originalPrice,
      discountedPrice: foodItem.discountedPrice,
      image: imageUrl,
      distance: distance,
      cuisine: foodItem.category,
      dietary: foodItem.dietary || [],
      pickupTime: `Today, ${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 12) + 1} PM`,
      rating: Number.parseFloat(rating),
      lat: lat,
      lng: lng,
      description: foodItem.description,
      expiryDate: foodItem.expiryDate,
      quantity: foodItem.quantity,
      ingredients: foodItem.ingredients,
      emissions: foodItem.emissions,
      address: foodItem.vendor.location || "Dubai, UAE",
      reviews: [
        {
          id: 1,
          user: "Ahmed M.",
          rating: 5,
          comment: "Excellent quality food, great value for money!",
          date: "2 days ago",
        },
        {
          id: 2,
          user: "Sarah K.",
          rating: 4,
          comment: "Very fresh and tasty. Will order again.",
          date: "1 week ago",
        },
      ],
    }

    return NextResponse.json(transformedItem)
  } catch (error) {
    console.error("Error fetching food item:", error)
    return NextResponse.json({ error: "Failed to fetch food item" }, { status: 500 })
  }
}
