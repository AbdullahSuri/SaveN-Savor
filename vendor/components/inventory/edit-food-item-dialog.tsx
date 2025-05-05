"use client"

import type React from "react"

import { type ReactNode, useState, useRef, useEffect } from "react"
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
import { api, FoodItem } from "@/services/api"
import { toast } from "react-toastify"
import { Upload, Image as ImageIcon } from "lucide-react"

interface EditFoodItemDialogProps {
  children: ReactNode
  foodItem: FoodItem
  onSuccess?: () => void  // Add onSuccess callback
}

export function EditFoodItemDialog({ children, foodItem, onSuccess }: EditFoodItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [category, setCategory] = useState(foodItem.category.toLowerCase())
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Add state to track dietary preferences
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(foodItem.dietary || [])

  // Update dietary preferences when foodItem changes
  useEffect(() => {
    setDietaryPreferences(foodItem.dietary || [])
  }, [foodItem])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getImageUrl = (item: FoodItem) => {
    if (item._id && item.image?.data) {
      return `data:${item.image.contentType};base64,${item.image.data}`
    }
    return null
  }

  // Toggle dietary preference
  const toggleDietaryPreference = (preference: string) => {
    setDietaryPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(p => p !== preference)
      } else {
        return [...prev, preference]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Get form values
      const formData = new FormData(e.target as HTMLFormElement)
      
      const name = formData.get('name') as string
      const originalPrice = parseFloat(formData.get('original-price') as string)
      const discountedPrice = parseFloat(formData.get('discounted-price') as string)
      const quantity = parseInt(formData.get('quantity') as string)
      const expiryDate = formData.get('expiry-date') as string
      const description = formData.get('description') as string
      
      const updateData: Partial<FoodItem> = {
        name,
        category,
        originalPrice,
        discountedPrice,
        quantity,
        expiryDate,
        description,
        dietary: dietaryPreferences // Use the state variable for dietary preferences
      }
      
      await api.updateFoodItem(foodItem._id!, updateData, imageFile || undefined)
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

  // Reset preview when dialog closes
  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setImagePreview(null)
      setImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      // Reset dietary preferences to the original food item values
      setDietaryPreferences(foodItem.dietary || [])
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Food Item</DialogTitle>
            <DialogDescription>Update the details of your surplus food item.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Item Name</Label>
                <Input name="name" id="edit-name" defaultValue={foodItem.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select name="category" value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="edit-category">
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
                <Label htmlFor="edit-original-price">Original Price ($)</Label>
                <Input
                  name="original-price"
                  id="edit-original-price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={foodItem.originalPrice}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discounted-price">Discounted Price ($)</Label>
                <Input 
                  name="discounted-price"
                  id="edit-discounted-price" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  defaultValue={foodItem.discountedPrice} 
                  required 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity Available</Label>
                <Input 
                  name="quantity"
                  id="edit-quantity" 
                  type="number" 
                  min="0" 
                  defaultValue={foodItem.quantity} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expiry-date">Expiry Date</Label>
                <Input 
                  name="expiry-date"
                  id="edit-expiry-date" 
                  type="date" 
                  defaultValue={foodItem.expiryDate} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                name="description"
                id="edit-description" 
                placeholder="Describe the food item..." 
                className="min-h-[100px]"
                defaultValue={foodItem.description}
              />
            </div>
            <div className="space-y-2">
              <Label>Dietary Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                {/* Updated dietary preferences with exact options requested */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vegetarian" 
                    checked={dietaryPreferences.includes("Vegetarian")}
                    onCheckedChange={() => toggleDietaryPreference("Vegetarian")}
                  />
                  <label
                    htmlFor="vegetarian"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vegetarian
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vegan" 
                    checked={dietaryPreferences.includes("Vegan")}
                    onCheckedChange={() => toggleDietaryPreference("Vegan")}
                  />
                  <label
                    htmlFor="vegan"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vegan
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vegan-options" 
                    checked={dietaryPreferences.includes("Vegan Options")}
                    onCheckedChange={() => toggleDietaryPreference("Vegan Options")}
                  />
                  <label
                    htmlFor="vegan-options"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vegan Options
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="gluten-free" 
                    checked={dietaryPreferences.includes("Gluten-Free")}
                    onCheckedChange={() => toggleDietaryPreference("Gluten-Free")}
                  />
                  <label
                    htmlFor="gluten-free"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Gluten-Free
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pescatarian" 
                    checked={dietaryPreferences.includes("Pescatarian")}
                    onCheckedChange={() => toggleDietaryPreference("Pescatarian")}
                  />
                  <label
                    htmlFor="pescatarian"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Pescatarian
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vegetarian-options" 
                    checked={dietaryPreferences.includes("Vegetarian Options")}
                    onCheckedChange={() => toggleDietaryPreference("Vegetarian Options")}
                  />
                  <label
                    htmlFor="vegetarian-options"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vegetarian Options
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Item Image</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="edit-image" 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {imageFile ? 'Change Image' : 'Update Image'}
                </Button>
                {(imagePreview || getImageUrl(foodItem)) && (
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                    <img 
                      src={imagePreview || getImageUrl(foodItem) || ''} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}