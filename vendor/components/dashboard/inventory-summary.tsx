import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function InventorySummary() {
  const inventoryItems = [
    {
      name: "Vegetable Curry",
      available: 8,
      total: 10,
      percentage: 80,
    },
    {
      name: "Chicken Biryani",
      available: 5,
      total: 12,
      percentage: 42,
    },
    {
      name: "Naan Bread",
      available: 15,
      total: 20,
      percentage: 75,
    },
    {
      name: "Samosas",
      available: 12,
      total: 30,
      percentage: 40,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Summary</CardTitle>
        <CardDescription>Current availability of your top items.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {inventoryItems.map((item) => (
          <div key={item.name} className="grid gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.available} / {item.total}
              </p>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
