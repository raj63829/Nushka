"use client"

import { useState } from "react"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { AdminProvider } from "./context/AdminContext"
import Header from "./components/Header"
import Home from "./components/pages/Home"
import Shop from "./components/pages/Shop"
import ProductDetail from "./components/pages/ProductDetail"
import Cart from "./components/pages/Cart"
import Wishlist from "./components/pages/Wishlist"
import About from "./components/pages/About"
import Checkout from "./components/pages/Checkout"
import Dashboard from "./components/pages/Dashboard"
import Contact from "./components/pages/Contact"
import AdminDashboard from "./components/pages/AdminDashboard"
import ManageProducts from "./components/pages/ManageProducts"
import ManageOrders from "./components/pages/ManageOrders"
import Footer from "./components/Footer"
import AuthForm from "./components/AuthForm"
import Signup from "./components/pages/Signup"
import AuthCallback from "./components/pages/AuthCallback"
import type { Product } from "./types"

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    setSelectedProduct(null)
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setCurrentPage("product-detail")
  }

  const handleBackToShop = () => {
    setCurrentPage("shop")
    setSelectedProduct(null)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onPageChange={handlePageChange} onProductClick={handleProductClick} />
      case "shop":
        return <Shop onProductClick={handleProductClick} />
      case "product-detail":
        return selectedProduct ? <ProductDetail product={selectedProduct} onBack={handleBackToShop} /> : null
      case "cart":
        return <Cart onBack={() => handlePageChange("shop")} onPageChange={handlePageChange} />
      case "wishlist":
        return <Wishlist onBack={() => handlePageChange("shop")} onPageChange={handlePageChange} />
      case "about":
        return <About />
      case "checkout":
        return <Checkout onBack={() => handlePageChange("cart")} onPageChange={handlePageChange} />
      case "dashboard":
        return <Dashboard />
      case "orders":
        return <Dashboard />
      case "auth":
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <AuthForm />
          </div>
        )
      case "signup": // ✅ New Signup Page
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Signup />
          </div>
        )
      case "auth-callback":
        return <AuthCallback onPageChange={handlePageChange} />
      case "rituals":
        return (
          <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold text-sage-800 mb-8">Skincare Rituals</h1>
              <p className="text-xl text-sage-700 mb-8">Coming Soon - Discover daily rituals for radiant skin</p>
              <button
                onClick={() => handlePageChange("shop")}
                className="bg-sage-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-sage-700 transition-colors duration-200"
              >
                Explore Products
              </button>
            </div>
          </div>
        )
      case "reviews":
        return (
          <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold text-sage-800 mb-8">Customer Reviews</h1>
              <p className="text-xl text-sage-700 mb-8">Read what our customers love about Nushka</p>
              <button
                onClick={() => handlePageChange("shop")}
                className="bg-sage-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-sage-700 transition-colors duration-200"
              >
                Shop Now
              </button>
            </div>
          </div>
        )
      case "contact":
        return <Contact />
      case "admin":
        return <AdminDashboard />
      case "admin-products":
        return (
          <AdminDashboard>
            <ManageProducts />
          </AdminDashboard>
        )
      case "admin-orders":
        return (
          <AdminDashboard>
            <ManageOrders />
          </AdminDashboard>
        )
      default:
        return <Home onPageChange={handlePageChange} onProductClick={handleProductClick} />
    }
  }

  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <div className="App">
            <Header currentPage={currentPage} onPageChange={handlePageChange} />
            {renderPage()}
            <Footer />
          </div>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  )
}

export default App
