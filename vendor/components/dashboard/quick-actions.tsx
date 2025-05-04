import { Plus, Package, ShoppingBag, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform quickly.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          Add New Food Item
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Package className="mr-2 h-4 w-4" />
          Manage Inventory
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <ShoppingBag className="mr-2 h-4 w-4" />
          View Orders
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />
          Generate Reports
        </Button>
      </CardContent>
    </Card>
  )
}
