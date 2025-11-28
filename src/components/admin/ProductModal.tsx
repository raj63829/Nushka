"use client"

import { X } from "lucide-react"
import type { Product, ProductInput } from "../../types/admin"
import { ProductForm } from "./ProductForm"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProductInput) => Promise<void>
  initialData?: Product | null
}

export function ProductModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{initialData ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <ProductForm
            initialData={initialData}
            onSubmit={async (values) => {
              await onSubmit(values)
              onClose()
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  )
}
