"use client"

import Link from "next/link"
import { CheckCircle, MapPin, Clock, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function OrderConfirmationPage() {
  // Mock order data
  const order = {
    id: "ORD-12345",
    date: "May 3, 2025",
    status: "Confirmed",
    items: [
      {
        id: 1,
        name: "Assorted Pastry Box",
        vendor: "Sweet Delights Bakery",
        price: 30,
        quantity: 1,
        image: "/placeholder.svg?key=qg6b4",
      },
      {
        id: 2,
        name: "Mediterranean Lunch Box",
        vendor: "Olive Garden Restaurant",
        price: 25,
        quantity: 2,
        image: "/placeholder.svg?key=kzp3a",
      },
    ],
    subtotal: 80,
    serviceFee: 2,
    total: 82,
    pickupAddress: "Sweet Delights Bakery, Shop 12, Al Wasl Road, Jumeirah, Dubai",
    pickupTime: "Today, 5-7 PM",
    impact: {
      foodSaved: 1.5, // in kg
      co2Saved: 3.2, // in kg
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your order. Your confirmation number is <span className="font-medium">{order.id}</span>
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Order placed on {order.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-2">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.vendor}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <span className="font-medium">AED {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>AED {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>AED {order.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>AED {order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pickup Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Pickup Address</h3>
                  <p className="text-gray-600">{order.pickupAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Pickup Time</h3>
                  <p className="text-gray-600">{order.pickupTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Order Date</h3>
                  <p className="text-gray-600">{order.date}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Get Directions
            </Button>
          </CardFooter>
        </Card>

        <Card className="mb-8 bg-green-50 border-green-100">
          <CardHeader>
            <CardTitle className="text-green-700">Your Environmental Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4">
                <div className="text-2xl font-bold text-green-600 mb-1">{order.impact.foodSaved} kg</div>
                <p className="text-green-700">Food Rescued</p>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-green-600 mb-1">{order.impact.co2Saved} kg</div>
                <p className="text-green-700">CO₂ Emissions Saved</p>
              </div>
            </div>
            <div className="mt-4 text-center text-green-700 text-sm">
              Thank you for making a difference! Share your impact with friends and family.
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Badge className="bg-green-600 hover:bg-green-700">Share Your Impact</Badge>
          </CardFooter>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/orders">View My Orders</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/browse">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
