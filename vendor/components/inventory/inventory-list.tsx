"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash, Leaf, Image as ImageIcon } from "lucide-react"
import { EditFoodItemDialog } from "@/components/inventory/edit-food-item-dialog"
import { api, FoodItem } from '@/services/api'

interface InventoryListProps {
  refreshTrigger?: number; // Add this prop to trigger refresh
}

export function InventoryList({ refreshTrigger }: InventoryListProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [inventoryItems, setInventoryItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [refreshTrigger]) // Fetch when refreshTrigger changes

  const fetchItems = async () => {
    try {
      const items = await api.getFoodItems()
      setInventoryItems(items)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === inventoryItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(inventoryItems.map((item) => item._id!))
    }
  }

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-500"
      case "Low Stock":
        return "bg-amber-500"
      case "Out of Stock":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatus = (item: FoodItem) => {
    if (item.quantity === 0) return 'Out of Stock'
    if (item.quantity < 5) return 'Low Stock'
    return 'Available'
  }

  const handleDelete = async (id: string) => {
    try {
      await api.deleteFoodItem(id)
      fetchItems() // Refresh the list
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const getImageUrl = (item: FoodItem) => {
    if (item._id && item.image?.data) {
      // Return base64 data URL for images stored in MongoDB
      return `data:${item.image.contentType};base64,${item.image.data}`
    }
    return null
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedItems.length === inventoryItems.length && inventoryItems.length > 0}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden md:table-cell">Quantity</TableHead>
            <TableHead className="hidden md:table-cell">Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Dietary</TableHead>
            <TableHead className="hidden lg:table-cell">CO2 Saved</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : inventoryItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                No food items found. Click 'Add New Item' to get started.
              </TableCell>
            </TableRow>
          ) : (
            inventoryItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(item._id!)}
                    onCheckedChange={() => toggleSelectItem(item._id!)}
                    aria-label={`Select ${item.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="w-16 h-16 rounded-md overflow-hidden border">
                    {getImageUrl(item) ? (
                      <img 
                        src={getImageUrl(item)!} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="hidden md:table-cell">{item.category}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>${item.discountedPrice.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                <TableCell className="hidden md:table-cell">{item.expiryDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(getStatus(item))}>{getStatus(item)}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {item.dietary.map((diet) => (
                      <Badge key={diet} variant="outline">
                        {diet}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Leaf className="h-4 w-4" />
                    <span>{item.emissions?.saved.toFixed(1) || '0.0'} kg</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <EditFoodItemDialog foodItem={item} onSuccess={fetchItems}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </EditFoodItemDialog>
                      <DropdownMenuItem onClick={() => handleDelete(item._id!)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}