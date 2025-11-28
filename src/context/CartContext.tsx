"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { CartItem, Product, WishlistItem } from "../types"
import { useAuth } from "./AuthContext"

interface CartState {
  items: CartItem[]
  wishlist: WishlistItem[]
  total: number
  itemCount: number
  isLoading: boolean
  lastSyncTime: number | null
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_TO_WISHLIST"; payload: Product }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string }
  | { type: "LOAD_CART"; payload: Partial<CartState> }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SYNC_SUCCESS"; payload: number }

const CartContext = createContext<
  | {
      state: CartState
      dispatch: React.Dispatch<CartAction>
      addToCart: (product: Product) => void
      removeFromCart: (id: string) => void
      updateQuantity: (id: string, quantity: number) => void
      clearCart: () => void
      addToWishlist: (product: Product) => void
      removeFromWishlist: (id: string) => void
      isInWishlist: (id: string) => boolean
      syncCart: () => Promise<void>
      getCartSummary: () => { subtotal: number; shipping: number; total: number }
    }
  | undefined
>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      let updatedItems: CartItem[]

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }]
      }

      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: updatedItems, total, itemCount }
    }

    case "REMOVE_FROM_CART": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: updatedItems, total, itemCount }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0)

      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

      return { ...state, items: updatedItems, total, itemCount }
    }

    case "CLEAR_CART":
      return { ...state, items: [], total: 0, itemCount: 0 }

    case "ADD_TO_WISHLIST": {
      const isAlreadyInWishlist = state.wishlist.some((item) => item.id === action.payload.id)
      if (isAlreadyInWishlist) return state

      return { ...state, wishlist: [...state.wishlist, action.payload] }
    }

    case "REMOVE_FROM_WISHLIST": {
      const updatedWishlist = state.wishlist.filter((item) => item.id !== action.payload)
      return { ...state, wishlist: updatedWishlist }
    }

    case "LOAD_CART":
      return { ...state, ...action.payload }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SYNC_SUCCESS":
      return { ...state, lastSyncTime: action.payload }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  wishlist: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  lastSyncTime: null,
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { state: authState } = useAuth()

  useEffect(() => {
    loadCart()
  }, [authState.isAuthenticated])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCart()
    }, 500) // Debounce saves by 500ms

    return () => clearTimeout(timeoutId)
  }, [state.items, state.wishlist, authState.isAuthenticated])

  const loadCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      if (authState.isAuthenticated && authState.user) {
        // Load from database for authenticated users
        await loadCartFromDatabase()
      } else {
        // Load from localStorage for guest users
        loadCartFromLocalStorage()
      }
    } catch (error) {
      console.error("Error loading cart:", error)
      // Fallback to localStorage if database fails
      loadCartFromLocalStorage()
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem("nushka-cart")
      if (savedCart) {
        const cartData = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartData })
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    }
  }

  const loadCartFromDatabase = async () => {
    if (!authState.user) return

    try {
      // Mock database loading - in real implementation, this would fetch from Supabase
      const userCartKey = `nushka-cart-${authState.user.user_id}`
      const savedCart = localStorage.getItem(userCartKey)

      if (savedCart) {
        const cartData = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartData })
        dispatch({ type: "SYNC_SUCCESS", payload: Date.now() })
      }

      // In real implementation:
      // const { data: cartItems } = await supabase
      //   .from('cart_items')
      //   .select(`
      //     *,
      //     products (*)
      //   `)
      //   .eq('user_id', authState.user.user_id);

      // const { data: wishlistItems } = await supabase
      //   .from('wishlist_items')
      //   .select(`
      //     *,
      //     products (*)
      //   `)
      //   .eq('user_id', authState.user.user_id);
    } catch (error) {
      console.error("Error loading cart from database:", error)
      throw error
    }
  }

  const saveCart = async () => {
    try {
      if (authState.isAuthenticated && authState.user) {
        // Save to database for authenticated users
        await saveCartToDatabase()
      } else {
        // Save to localStorage for guest users
        saveCartToLocalStorage()
      }
    } catch (error) {
      console.error("Error saving cart:", error)
      // Fallback to localStorage
      saveCartToLocalStorage()
    }
  }

  const saveCartToLocalStorage = () => {
    try {
      const cartData = {
        items: state.items,
        wishlist: state.wishlist,
        total: state.total,
        itemCount: state.itemCount,
        lastSyncTime: Date.now(),
      }

      if (authState.user) {
        // Save user-specific cart
        const userCartKey = `nushka-cart-${authState.user.user_id}`
        localStorage.setItem(userCartKey, JSON.stringify(cartData))
      } else {
        // Save guest cart
        localStorage.setItem("nushka-cart", JSON.stringify(cartData))
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }

  const saveCartToDatabase = async () => {
    if (!authState.user) return

    try {
      // Mock database saving - save to user-specific localStorage key
      const userCartKey = `nushka-cart-${authState.user.user_id}`
      const cartData = {
        items: state.items,
        wishlist: state.wishlist,
        total: state.total,
        itemCount: state.itemCount,
        lastSyncTime: Date.now(),
      }

      localStorage.setItem(userCartKey, JSON.stringify(cartData))
      dispatch({ type: "SYNC_SUCCESS", payload: Date.now() })

      // In real implementation:
      // await supabase.from('cart_items').delete().eq('user_id', authState.user.user_id);
      //
      // if (state.items.length > 0) {
      //   const cartItemsToInsert = state.items.map(item => ({
      //     user_id: authState.user!.user_id,
      //     product_id: item.id,
      //     quantity: item.quantity
      //   }));
      //
      //   await supabase.from('cart_items').insert(cartItemsToInsert);
      // }
    } catch (error) {
      console.error("Error saving cart to database:", error)
      throw error
    }
  }

  const syncCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      await saveCart()
      await loadCart()
    } catch (error) {
      console.error("Error syncing cart:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const getCartSummary = () => {
    const subtotal = state.total
    const shipping = subtotal >= 1999 ? 0 : 99 // Free shipping over ₹1999
    const total = subtotal + shipping

    return { subtotal, shipping, total }
  }

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", payload: product })

    // Show success notification (you could add a toast system here)
    console.log(`Added ${product.name} to cart`)
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const addToWishlist = (product: Product) => {
    dispatch({ type: "ADD_TO_WISHLIST", payload: product })
    console.log(`Added ${product.name} to wishlist`)
  }

  const removeFromWishlist = (id: string) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: id })
  }

  const isInWishlist = (id: string) => {
    return state.wishlist.some((item) => item.id === id)
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        syncCart,
        getCartSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
