"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FoodItem {
  id: number
  name: string
  vendor: string
  originalPrice: number
  discountedPrice: number
  image: string
  distance: string
  cuisine: string
  dietary: string[]
  pickupTime: string
  rating: number
  lat: number
  lng: number
}

interface FoodMapProps {
  items: FoodItem[]
  userLocation: { lat: number; lng: number } | null
}

// Declare google as a global variable
declare global {
  interface Window {
    google: any
  }
}

export default function FoodMap({ items, userLocation }: FoodMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      console.log("In a real app, we would load Google Maps here")
      // Create a placeholder map element
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; color: #666;">
            <div style="text-align: center;">
              <p>Google Maps would display here</p>
              <p>Add your API key to enable maps</p>
            </div>
          </div>
        `
      }
    }

    const initializeMap = () => {
      console.log("Map initialization would happen here with a valid API key")
      loadGoogleMapsScript()
    }

    initializeMap()
    return () => {
      // Cleanup would happen here
    }
  }, [items, userLocation])

  useEffect(() => {
    console.log("Map markers would update here with items:", items)
  }, [items])

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="w-auto">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Your Location</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">Food Locations ({items.length})</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
