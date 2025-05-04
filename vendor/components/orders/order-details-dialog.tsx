"use client"

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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, X } from "lucide-react"

interface Order {
  id: string
  customer: string
  items: string
  total: string
  status: string
  date: string
  pickupTime: string
}

interface OrderDetailsDialogProps {
  children: ReactNode
  order: Order
}

export function OrderDetailsDialog({ children, order }: OrderDetailsDialogProps) {
  const [open, setOpen] = useState(false)

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>View the details of order {order.id}.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Order {order.id}</h3>
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Customer Information</h4>
              <p className="text-sm">{order.customer}</p>
              <p className="text-sm text-muted-foreground">customer@example.com</p>
              <p className="text-sm text-muted-foreground">+971 50 123 4567</p>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Order Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Date:</span>
                  <span>{order.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pickup Time:</span>
                  <span>{order.pickupTime}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Items</h4>
              <div className="space-y-2">
                {order.items.split(", ").map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item}</span>
                    <span>${(Math.random() * 10 + 2).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{order.total}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          {order.status === "Pending" && (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
              <Button onClick={() => setOpen(false)}>
                <Check className="mr-2 h-4 w-4" />
                Mark as Ready
              </Button>
            </>
          )}
          {order.status === "Ready for pickup" && (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
              <Button onClick={() => setOpen(false)}>
                <Check className="mr-2 h-4 w-4" />
                Complete Order
              </Button>
            </>
          )}
          {(order.status === "Completed" || order.status === "Cancelled") && (
            <Button onClick={() => setOpen(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
