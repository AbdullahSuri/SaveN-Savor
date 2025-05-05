"use client"

import { ArrowUpIcon, Leaf, DollarSign, ShoppingBag, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export function DashboardStats() {
  const [loading, setLoading] = useState(true)
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-6 w-20 rounded-md bg-muted animate-pulse"></div>
          ) : (
            <div className="text-2xl font-bold">2,845</div>
          )}
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              17%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-6 w-20 rounded-md bg-muted animate-pulse"></div>
          ) : (
            <div className="text-2xl font-bold">$68,592</div>
          )}
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              12.5%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Food Saved</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-6 w-20 rounded-md bg-muted animate-pulse"></div>
          ) : (
            <div className="text-2xl font-bold">5,286 kg</div>
          )}
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              23%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CO2 Reduced</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-6 w-20 rounded-md bg-muted animate-pulse"></div>
          ) : (
            <div className="text-2xl font-bold">18.4 tons</div>
          )}
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              19.2%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}