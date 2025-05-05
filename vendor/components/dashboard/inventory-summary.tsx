"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { api, FoodItem } from "@/services/api"

interface InventoryItemSummary {
  name: string
  available: number
  total: number
  percentage: number
}

export function InventorySummary() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        setLoading(true)
        
        // Fetch food items from the API
        const foodItems = await api.getFoodItems()
        
        // Process and sort food items
        processInventoryItems(foodItems)
      } catch (error) {
        console.error("Error fetching inventory items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryItems()
  }, [])

  // Process food items and create summary data
  const processInventoryItems = (foodItems: FoodItem[]) => {
    if (!foodItems || foodItems.length === 0) return

    // Sort items by quantity
    const sortedItems = [...foodItems].sort((a, b) => b.quantity - a.quantity)
    
    // Take top 4 items
    const topItems = sortedItems.slice(0, 4)
    
    // Transform to summary format
    const summaryItems = topItems.map(item => {
      // For demo, we'll assume total is quantity + 20%
      const total = Math.round(item.quantity * 1.2)
      
      return {
        name: item.name,
        available: item.quantity,
        total: total,
        percentage: Math.round((item.quantity / total) * 100)
      }
    })
    
    setInventoryItems(summaryItems)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Summary</CardTitle>
        <CardDescription>Current availability of your top items.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading ? (
          // Loading skeleton
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-2 w-full bg-muted rounded animate-pulse"></div>
            </div>
          ))
        ) : inventoryItems.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No inventory items available
          </div>
        ) : (
          inventoryItems.map((item) => (
            <div key={item.name} className="grid gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.available} / {item.total}
                </p>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}