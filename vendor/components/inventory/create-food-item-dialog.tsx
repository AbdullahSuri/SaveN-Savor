"use client"

import React, { ReactNode, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/services/api"
import { toast } from "react-toastify"
import { FoodItemForm } from "@/components/inventory/food-item-form"
import { TimeSlot } from "@/components/inventory/pickup-time-slots"

interface CreateFoodItemDialogProps {
  children: ReactNode
  onSuccess?: () => void // Callback for successful creation
}

export function CreateFoodItemDialog({ children, onSuccess }: CreateFoodItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: any, ingredients: string[], timeSlots: TimeSlot[], imageFile?: File) => {
    setLoading(true)
    
    try {
      // Add vendor information
      const foodItemData = {
        ...formData,
        vendor: {
          name: 'Spice Garden',
          id: 'Spice Garden', // Matching the ID used in the backend
          location: 'Dubai'
        }
      }
      
      // Create the food item with emissions calculation
      await api.createFoodItem(foodItemData, ingredients, timeSlots, imageFile)
      
      toast.success(`Food item created successfully!`)
      setOpen(false)
      
      // Call the onSuccess callback to refresh the inventory list
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error creating food item:', error)
      toast.error('Failed to create food item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Food Item</DialogTitle>
          <DialogDescription>Create a new surplus food item to list on SaveN&apos;Savor.</DialogDescription>
        </DialogHeader>
        <FoodItemForm 
          onSubmit={handleSubmit} 
          isSubmitting={loading} 
        />
      </DialogContent>
    </Dialog>
  )
}