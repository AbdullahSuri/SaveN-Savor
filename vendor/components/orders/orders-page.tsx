import { MainLayout } from "@/components/layout/main-layout"
import { OrdersList } from "@/components/orders/orders-list"
import { OrdersFilters } from "@/components/orders/orders-filters"

export function OrdersPage() {
  return (
    <MainLayout title="Orders">
      <div className="grid gap-6">
        <OrdersFilters />
        <OrdersList />
      </div>
    </MainLayout>
  )
}
