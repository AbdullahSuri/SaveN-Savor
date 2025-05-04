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
    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      script.onload = initializeMap
    }

    // Initialize map
    const initializeMap = () => {
      if (!mapRef.current) return

      const defaultLocation = { lat: 25.2048, lng: 55.2708 } // Dubai center
      const mapLocation = userLocation || defaultLocation

      const mapOptions: google.maps.MapOptions = {
        center: mapLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      }

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions)
      infoWindowRef.current = new window.google.maps.InfoWindow()

      // Add user location marker if available
      if (userLocation) {
        new window.google.maps.Marker({
          position: userLocation,
          map: mapInstanceRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4CAF50",
            fillOpacity: 0.4,
            strokeWeight: 2,
            strokeColor: "#4CAF50",
          },
          title: "Your Location",
        })
      }

      // Add food item markers
      addMarkers()
    }

    // Add markers for food items
    const addMarkers = () => {
      if (!mapInstanceRef.current) return

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      // Add new markers
      items.forEach((item) => {
        const marker = new window.google.maps.Marker({
          position: { lat: item.lat, lng: item.lng },
          map: mapInstanceRef.current,
          title: item.name,
          animation: window.google.maps.Animation.DROP,
        })

        // Create info window content
        const contentString = `
          <div style="width: 250px; padding: 5px;">
            <h3 style="margin: 0 0 5px; font-size: 16px; font-weight: bold;">${item.name}</h3>
            <p style="margin: 0 0 5px; font-size: 14px; color: #666;">${item.vendor}</p>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <span style="text-decoration: line-through; color: #666; margin-right: 5px;">AED ${item.originalPrice}</span>
              <span style="color: #4CAF50; font-weight: bold;">AED ${item.discountedPrice}</span>
              <span style="background: #4CAF50; color: white; padding: 2px 4px; border-radius: 4px; margin-left: 5px; font-size: 12px;">
                ${Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)}% OFF
              </span>
            </div>
            <a href="/food/${item.id}" style="display: block; text-align: center; background: #4CAF50; color: white; padding: 6px; border-radius: 4px; text-decoration: none; font-size: 14px;">
              View Details
            </a>
          </div>
        `

        // Add click event to marker
        marker.addListener("click", () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(contentString)
            infoWindowRef.current.open(mapInstanceRef.current, marker)
          }
        })

        markersRef.current.push(marker)
      })

      // Fit bounds to markers if there are any
      if (markersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        markersRef.current.forEach((marker) => {
          bounds.extend(marker.getPosition()!)
        })
        if (userLocation) {
          bounds.extend(userLocation)
        }
        mapInstanceRef.current.fitBounds(bounds)
      }
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap()
    } else {
      loadGoogleMapsScript()
    }

    return () => {
      // Clean up markers
      if (markersRef.current) {
        markersRef.current.forEach((marker) => marker.setMap(null))
      }
    }
  }, [items, userLocation])

  // Update markers when items change
  useEffect(() => {
    if (mapInstanceRef.current && items.length > 0) {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      // Add new markers
      items.forEach((item) => {
        const marker = new window.google.maps.Marker({
          position: { lat: item.lat, lng: item.lng },
          map: mapInstanceRef.current,
          title: item.name,
        })

        // Create info window content
        const contentString = `
          <div style="width: 250px; padding: 5px;">
            <h3 style="margin: 0 0 5px; font-size: 16px; font-weight: bold;">${item.name}</h3>
            <p style="margin: 0 0 5px; font-size: 14px; color: #666;">${item.vendor}</p>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <span style="text-decoration: line-through; color: #666; margin-right: 5px;">AED ${item.originalPrice}</span>
              <span style="color: #4CAF50; font-weight: bold;">AED ${item.discountedPrice}</span>
              <span style="background: #4CAF50; color: white; padding: 2px 4px; border-radius: 4px; margin-left: 5px; font-size: 12px;">
                ${Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)}% OFF
              </span>
            </div>
            <a href="/food/${item.id}" style="display: block; text-align: center; background: #4CAF50; color: white; padding: 6px; border-radius: 4px; text-decoration: none; font-size: 14px;">
              View Details
            </a>
          </div>
        `

        // Add click event to marker
        marker.addListener("click", () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(contentString)
            infoWindowRef.current.open(mapInstanceRef.current, marker)
          }
        })

        markersRef.current.push(marker)
      })

      // Fit bounds to markers if there are any
      if (markersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        markersRef.current.forEach((marker) => {
          bounds.extend(marker.getPosition()!)
        })
        if (userLocation) {
          bounds.extend(userLocation)
        }
        mapInstanceRef.current.fitBounds(bounds)
      }
    }
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
