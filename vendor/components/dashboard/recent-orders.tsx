"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export function RecentOrders() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1600)
    
    return () => clearTimeout(timer)
  }, [])

  // Larger mock order data
  const orders = [
    {
      id: "ORD-7842",
      customer: "Sarah Ahmed",
      items: "Chicken Biryani, Garlic Naan (2), Mango Lassi",
      total: "$38.75",
      status: "Ready for pickup",
      time: "Today, 2:30 PM",
      avatar: "/diverse-group.png",
    },
    {
      id: "ORD-7841",
      customer: "Michael Chen",
      items: "Butter Chicken, Vegetable Samosas (4), Rice, Raita",
      total: "$42.50",
      status: "Completed",
      time: "Today, 1:15 PM",
      avatar: "/diverse-group.png",
    },
    {
      id: "ORD-7840",
      customer: "Aisha Khan",
      items: "Vegetable Curry, Paneer Tikka, Garlic Naan, Chai Tea (2)",
      total: "$36.25",
      status: "Pending",
      time: "Today, 3:45 PM",
      avatar: "/diverse-group.png",
    },
    {
      id: "ORD-7839",
      customer: "David Wilson",
      items: "Family Feast: Mixed Grill, Curry Selection, Bread Basket, Dessert Platter",
      total: "$89.00",
      status: "Completed",
      time: "Today, 12:10 PM",
      avatar: "/diverse-group.png",
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>You have {orders.length} recent orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          // Loading skeleton
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={order.avatar || "/placeholder.svg"} alt={order.customer} />
                    <AvatarFallback>{order.customer.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.items}</p>
                    <div className="flex items-center pt-1">
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                      <Badge
                        variant={order.status === "Completed" ? "outline" : "default"}
                        className={`ml-2 ${order.status === "Completed" ? "" : order.status === "Pending" ? "bg-amber-500" : "bg-emerald-500"}`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="font-medium">{order.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => router.push('/orders')}
        >
          View All Orders
        </Button>
      </CardFooter>
    </Card>
  )
}