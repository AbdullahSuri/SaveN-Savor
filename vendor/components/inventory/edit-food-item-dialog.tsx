"use client"

import type React from "react"

import { type ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface FoodItem {
  id: string
  name: string
  category: string
  price: number
  originalPrice: number
  quantity: number
  expiryDate: string
  status: string
  dietary: string[]
}

interface EditFoodItemDialogProps {
  children: ReactNode
  foodItem: FoodItem
}

export function EditFoodItemDialog({ children, foodItem }: EditFoodItemDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Food Item</DialogTitle>
            <DialogDescription>Update the details of your surplus food item.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" defaultValue={foodItem.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue={foodItem.category.toLowerCase()} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-course">Main Course</SelectItem>
                    <SelectItem value="appetizer">Appetizer</SelectItem>
                    <SelectItem value="side">Side</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="beverage">Beverage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="original-price">Original Price ($)</Label>
                <Input
                  id="original-price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={foodItem.originalPrice}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discounted-price">Discounted Price ($)</Label>
                <Input id="discounted-price" type="number" step="0.01" min="0" defaultValue={foodItem.price} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Available</Label>
                <Input id="quantity" type="number" min="0" defaultValue={foodItem.quantity} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input id="expiry-date" type="date" defaultValue={foodItem.expiryDate} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the food item..." className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label>Dietary Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="vegetarian" defaultChecked={foodItem.dietary.includes("Vegetarian")} />
                  <label
                    htmlFor="vegetarian"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vegetarian
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="vegan" defaultChecked={foodItem.dietary.includes("Vegan")} />
                  <label
                    htmlFor="vegan"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vegan
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="gluten-free" defaultChecked={foodItem.dietary.includes("Gluten Free")} />
                  <label
                    htmlFor="gluten-free"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Gluten Free
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="dairy-free" defaultChecked={foodItem.dietary.includes("Dairy Free")} />
                  <label
                    htmlFor="dairy-free"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Dairy Free
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Item Image</Label>
              <Input id="image" type="file" accept="image/*" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
