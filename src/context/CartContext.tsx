import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product, WishlistItem } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface CartState {
  items: CartItem[];
  wishlist: WishlistItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'LOAD_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let updatedItems: CartItem[];
      
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { ...state, items: updatedItems, total, itemCount };
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { ...state, items: updatedItems, total, itemCount };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { ...state, items: updatedItems, total, itemCount };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0 };
    
    case 'ADD_TO_WISHLIST': {
      const isAlreadyInWishlist = state.wishlist.some(item => item.id === action.payload.id);
      if (isAlreadyInWishlist) return state;
      
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    }
    
    case 'REMOVE_FROM_WISHLIST': {
      const updatedWishlist = state.wishlist.filter(item => item.id !== action.payload);
      return { ...state, wishlist: updatedWishlist };
    }
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  wishlist: [],
  total: 0,
  itemCount: 0
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { state: authState } = useAuth();

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      // Load cart from database for authenticated users
      loadCartFromDatabase();
    } else {
      // Load cart from localStorage for guest users
      const savedCart = localStorage.getItem('nushka-cart');
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      }
    }
  }, [authState.isAuthenticated]);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      // Save cart to database for authenticated users
      saveCartToDatabase();
    } else {
      // Save cart to localStorage for guest users
      localStorage.setItem('nushka-cart', JSON.stringify(state));
    }
  }, [state]);

  const loadCartFromDatabase = async () => {
    if (!authState.user) return;
    
    try {
      const { data: cartItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', authState.user.user_id);
      
      const { data: wishlistItems } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', authState.user.user_id);
      
      // Convert database items to cart format
      // This would need product data joined - simplified for now
      if (cartItems || wishlistItems) {
        // Implementation would join with products table
        console.log('Cart loaded from database');
      }
    } catch (error) {
      console.error('Error loading cart from database:', error);
    }
  };

  const saveCartToDatabase = async () => {
    if (!authState.user) return;
    
    try {
      // Clear existing cart items
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', authState.user.user_id);
      
      // Insert current cart items
      if (state.items.length > 0) {
        const cartItemsToInsert = state.items.map(item => ({
          user_id: authState.user!.user_id,
          product_id: item.id,
          quantity: item.quantity
        }));
        
        await supabase
          .from('cart_items')
          .insert(cartItemsToInsert);
      }
      
      // Save wishlist items
      await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', authState.user.user_id);
      
      if (state.wishlist.length > 0) {
        const wishlistItemsToInsert = state.wishlist.map(item => ({
          user_id: authState.user!.user_id,
          product_id: item.id
        }));
        
        await supabase
          .from('wishlist')
          .insert(wishlistItemsToInsert);
      }
    } catch (error) {
      console.error('Error saving cart to database:', error);
    }
  };

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
  };

  const isInWishlist = (id: string) => {
    return state.wishlist.some(item => item.id === id);
  };

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};