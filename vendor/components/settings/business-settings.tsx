"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BusinessSettings() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>Manage your business details and location information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input id="business-name" defaultValue="Spice Garden Restaurant" disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-type">Business Type</Label>
            <Select disabled={!isEditing} defaultValue="restaurant">
              <SelectTrigger id="business-type">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="cafe">Café</SelectItem>
                <SelectItem value="bakery">Bakery</SelectItem>
                <SelectItem value="grocery">Grocery Store</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-description">Business Description</Label>
            <Textarea
              id="business-description"
              defaultValue="Authentic Indian cuisine with a modern twist. We specialize in flavorful curries, tandoori dishes, and freshly baked bread."
              disabled={!isEditing}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="business-email">Business Email</Label>
              <Input id="business-email" type="email" defaultValue="info@spicegarden.com" disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-phone">Business Phone</Label>
              <Input id="business-phone" type="tel" defaultValue="+971 4 123 4567" disabled={!isEditing} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-address">Address</Label>
            <Textarea
              id="business-address"
              defaultValue="123 Al Wasl Road, Jumeirah, Dubai, UAE"
              disabled={!isEditing}
              className="min-h-[80px]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="business-city">City</Label>
              <Input id="business-city" defaultValue="Dubai" disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-state">Emirate</Label>
              <Input id="business-state" defaultValue="Dubai" disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-zip">Postal Code</Label>
              <Input id="business-zip" defaultValue="12345" disabled={!isEditing} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Business Info"}
        </Button>
        {isEditing && <Button>Save Changes</Button>}
      </CardFooter>
    </Card>
  )
}
