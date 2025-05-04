import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentOrders() {
  const orders = [
    {
      id: "ORD-1234",
      customer: "Sarah Ahmed",
      items: "Vegetable Curry, Naan Bread (2)",
      total: "$12.50",
      status: "Ready for pickup",
      time: "Today, 2:30 PM",
      avatar: "/diverse-group.png",
    },
    {
      id: "ORD-1233",
      customer: "Michael Chen",
      items: "Chicken Biryani, Samosas (4)",
      total: "$18.75",
      status: "Completed",
      time: "Today, 1:15 PM",
      avatar: "/diverse-group.png",
    },
    {
      id: "ORD-1232",
      customer: "Aisha Khan",
      items: "Mixed Platter, Mango Lassi",
      total: "$15.25",
      status: "Completed",
      time: "Today, 12:45 PM",
      avatar: "/diverse-group.png",
    },
    {
      id: "ORD-1231",
      customer: "David Wilson",
      items: "Butter Chicken, Rice, Naan",
      total: "$22.00",
      status: "Completed",
      time: "Yesterday, 7:30 PM",
      avatar: "/diverse-group.png",
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>You have {orders.length} recent orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={order.avatar || "/placeholder.svg"} alt={order.customer} />
                  <AvatarFallback>{order.customer.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">{order.items}</p>
                  <div className="flex items-center pt-1">
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                    <Badge
                      variant={order.status === "Completed" ? "outline" : "default"}
                      className={`ml-2 ${order.status === "Completed" ? "" : "bg-emerald-500"}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <p className="font-medium">{order.total}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Orders
        </Button>
      </CardFooter>
    </Card>
  )
}
