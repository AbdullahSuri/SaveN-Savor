"use client"

import { type ReactNode, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api, FoodItem } from "@/services/api"
import { toast } from "react-toastify"
import { FoodItemForm } from "@/components/inventory/food-item-form"
import { TimeSlot } from "@/components/inventory/pickup-time-slots"

interface EditFoodItemDialogProps {
  children: ReactNode
  foodItem: FoodItem
  onSuccess?: () => void  // Callback for successful update
}

export function EditFoodItemDialog({ children, foodItem, onSuccess }: EditFoodItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: any, ingredients: string[], timeSlots: TimeSlot[], imageFile?: File) => {
    setLoading(true)
    
    try {
      // Add vendor information if it's not already included
      const updateData = {
        ...formData,
        vendor: formData.vendor || foodItem.vendor || {
          name: 'Spice Garden',
          id: 'Spice Garden',
          location: 'Dubai'
        }
      }
      
      // Update the food item with emissions calculation
      await api.updateFoodItem(foodItem._id, updateData, ingredients, timeSlots, imageFile)
      
      toast.success('Food item updated successfully!')
      setOpen(false)
      
      // Call onSuccess callback to refresh the list
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating food item:', error)
      toast.error('Failed to update food item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Food Item</DialogTitle>
          <DialogDescription>Update the details of your surplus food item.</DialogDescription>
        </DialogHeader>
        <FoodItemForm 
          initialData={foodItem}
          onSubmit={handleSubmit} 
          isSubmitting={loading} 
        />
      </DialogContent>
    </Dialog>
  )
}