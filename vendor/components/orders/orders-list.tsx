"use client"

import { useState } from "react"
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
import { Check, Eye, MoreHorizontal, X } from "lucide-react"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"

export function OrdersList() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const orders = [
    {
      id: "ORD-1234",
      customer: "Sarah Ahmed",
      items: "Vegetable Curry, Naan Bread (2)",
      total: "$12.50",
      status: "Ready for pickup",
      date: "Today, 2:30 PM",
      pickupTime: "Today, 3:30 PM",
    },
    {
      id: "ORD-1233",
      customer: "Michael Chen",
      items: "Chicken Biryani, Samosas (4)",
      total: "$18.75",
      status: "Completed",
      date: "Today, 1:15 PM",
      pickupTime: "Today, 2:00 PM",
    },
    {
      id: "ORD-1232",
      customer: "Aisha Khan",
      items: "Mixed Platter, Mango Lassi",
      total: "$15.25",
      status: "Completed",
      date: "Today, 12:45 PM",
      pickupTime: "Today, 1:30 PM",
    },
    {
      id: "ORD-1231",
      customer: "David Wilson",
      items: "Butter Chicken, Rice, Naan",
      total: "$22.00",
      status: "Completed",
      date: "Yesterday, 7:30 PM",
      pickupTime: "Yesterday, 8:15 PM",
    },
    {
      id: "ORD-1230",
      customer: "Emma Rodriguez",
      items: "Vegetable Samosas (6), Chutney",
      total: "$9.50",
      status: "Pending",
      date: "Today, 3:15 PM",
      pickupTime: "Today, 4:00 PM",
    },
  ]

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((order) => order.id))
    }
  }

  const toggleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id))
    } else {
      setSelectedOrders([...selectedOrders, id])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ready for pickup":
        return "bg-emerald-500"
      case "completed":
        return "bg-blue-500"
      case "pending":
        return "bg-amber-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedOrders.length === orders.length && orders.length > 0}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Pickup Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={() => toggleSelectOrder(order.id)}
                  aria-label={`Select ${order.id}`}
                />
              </TableCell>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell className="hidden md:table-cell">{order.items}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{order.date}</TableCell>
              <TableCell className="hidden md:table-cell">{order.pickupTime}</TableCell>
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
                    <OrderDetailsDialog order={order}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </OrderDetailsDialog>
                    {order.status === "Pending" && (
                      <DropdownMenuItem>
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Ready
                      </DropdownMenuItem>
                    )}
                    {order.status === "Ready for pickup" && (
                      <DropdownMenuItem>
                        <Check className="mr-2 h-4 w-4" />
                        Complete Order
                      </DropdownMenuItem>
                    )}
                    {(order.status === "Pending" || order.status === "Ready for pickup") && (
                      <DropdownMenuItem>
                        <X className="mr-2 h-4 w-4" />
                        Cancel Order
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
