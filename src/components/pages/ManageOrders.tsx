import { OrderTable } from "../admin/OrderTable"

export default function ManageOrders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-1">Track and manage customer orders</p>
      </div>
      <OrderTable />
    </div>
  )
}
