import { ProductTable } from "../admin/ProductTable"

export default function ManageProducts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <p className="text-gray-600 mt-1">Manage your product inventory and details</p>
      </div>
      <ProductTable />
    </div>
  )
}
