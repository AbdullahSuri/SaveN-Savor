"use client"

import React, { ReactNode, useState, useRef } from "react"
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
import { Upload, Camera } from "lucide-react"

interface CreateFoodItemDialogProps {
  children: ReactNode
  onSuccess?: () => void // Add callback for successful creation
}

export function CreateFoodItemDialog({ children, onSuccess }: CreateFoodItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Add state for dietary preferences
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])

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

  // Handle dietary preference toggle
  const toggleDietaryPreference = (preference: string) => {
    setDietaryPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(p => p !== preference)
      } else {
        return [...prev, preference]
      }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    // Get all form field values
    const name = (document.getElementById('name') as HTMLInputElement)?.value
    const originalPrice = parseFloat((document.getElementById('original-price') as HTMLInputElement)?.value || '0')
    const discountedPrice = parseFloat((document.getElementById('discounted-price') as HTMLInputElement)?.value || '0')
    const quantity = parseInt((document.getElementById('quantity') as HTMLInputElement)?.value || '0')
    const expiryDate = (document.getElementById('expiry-date') as HTMLInputElement)?.value
    const description = (document.getElementById('description') as HTMLTextAreaElement)?.value
    const ingredientsInput = (document.getElementById('ingredients') as HTMLTextAreaElement)?.value
    
    // Parse ingredients from textarea
    const ingredientsList = ingredientsInput
      .split('\n')
      .map(i => i.trim())
      .filter(i => i.length > 0)
    
    if (ingredientsList.length === 0) {
      toast.error("Please add at least one ingredient")
      setLoading(false)
      return
    }
    
    try {
      const foodItem: Omit<FoodItem, '_id' | 'emissions'> = {
        name: name || '',
        category: category,
        originalPrice: originalPrice,
        discountedPrice: discountedPrice,
        quantity: quantity,
        expiryDate: expiryDate || '',
        description: description || '',
        dietary: dietaryPreferences, // Use the state variable directly
        vendor: {
          name: 'Spice Garden',
          id: 'vendor-123',
          location: 'Dubai'
        },
        ingredients: [] // Will be added by API
      }
      
      // Create the food item with emissions calculation and image
      const createdItem = await api.createFoodItem(foodItem, ingredientsList, imageFile || undefined)
      
      toast.success(`Food item created successfully! CO2 saved: ${createdItem.emissions?.saved.toFixed(1)} kg`)
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

  // Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      // Reset form fields
      const form = document.getElementById('create-food-item-form') as HTMLFormElement
      if (form) {
        form.reset()
      }
      setCategory('')
      setImagePreview(null)
      setImageFile(null)
      setDietaryPreferences([]) // Reset dietary preferences
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form id="create-food-item-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <DialogHeader>
            <DialogTitle>Add New Food Item</DialogTitle>
            <DialogDescription>Create a new surplus food item to list on SaveN&apos;Savor.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" placeholder="Enter item name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={setCategory} value={category} required>
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
                <Input id="original-price" type="number" step="0.01" min="0" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discounted-price">Discounted Price ($)</Label>
                <Input id="discounted-price" type="number" step="0.01" min="0" placeholder="0.00" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Available</Label>
                <Input id="quantity" type="number" min="0" placeholder="0" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input id="expiry-date" type="date" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (one per line)</Label>
              <Textarea 
                id="ingredients"
                placeholder={`e.g.:
Rice
Chicken
Turmeric
Onions
Vegetable oil`}
                className="min-h-[120px]"
                required
              />
              <p className="text-sm text-muted-foreground">Add each ingredient on a new line for accurate emissions calculation</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the food item..." className="min-h-[80px]" />
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
              <Label htmlFor="image">Item Image</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="image" 
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
                  {imageFile ? 'Change Image' : 'Upload Image'}
                </Button>
                {imagePreview && (
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                    <img 
                      src={imagePreview} 
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
              {loading ? 'Creating...' : 'Create Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}