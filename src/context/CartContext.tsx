"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from "react";
import { Product } from "@/types";
import { createBrowser } from "@/lib/supabase-browser";
import { useAuth } from "@/context/AuthContext";

export interface CartItem {
  product: Product; quantity: number; finish: string;
  unitPrice: number; notes?: string; designFileName?: string;
}

interface CartState { items: CartItem[]; isOpen: boolean; }

type CartAction =
  | { type: "ADD_ITEM";    payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY";  payload: { id: string; quantity: number } }
  | { type: "SET_ITEMS";   payload: CartItem[] }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART"  }
  | { type: "CLOSE_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":   return { ...state, items: action.payload };
    case "ADD_ITEM": {
      const idx = state.items.findIndex((i) => i.product.id === action.payload.product.id && i.finish === action.payload.finish);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], quantity: items[idx].quantity + action.payload.quantity };
        return { ...state, items, isOpen: true };
      }
      return { ...state, items: [...state.items, action.payload], isOpen: true };
    }
    case "REMOVE_ITEM": return { ...state, items: state.items.filter((i) => i.product.id !== action.payload) };
    case "UPDATE_QTY":  return { ...state, items: state.items.map((i) => i.product.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i) };
    case "CLEAR_CART":  return { ...state, items: [] };
    case "OPEN_CART":   return { ...state, isOpen: true };
    case "CLOSE_CART":  return { ...state, isOpen: false };
    default: return state;
  }
}

interface CartContextValue {
  items: CartItem[]; isOpen: boolean; itemCount: number;
  subtotal: number; deliveryFee: number; total: number;
  addItem: (item: CartItem) => void; removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void; openCart: () => void; closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function mergeItems(items: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of items) {
    const key = `${item.product.id}-${item.finish}`;
    if (map.has(key)) { map.get(key)!.quantity += item.quantity; }
    else { map.set(key, { ...item }); }
  }
  return Array.from(map.values());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const { user } = useAuth();
  const supabase  = createBrowser();

  // Load cart on mount / user change
  useEffect(() => {
    const guestItems: CartItem[] = JSON.parse(localStorage.getItem("angela_guest_cart") ?? "[]");
    if (user) {
      supabase.from("carts").select("items").eq("user_id", user.id).single().then(({ data }) => {
        const dbItems: CartItem[] = Array.isArray(data?.items) ? data.items : [];
        const merged = mergeItems([...dbItems, ...guestItems]);
        dispatch({ type: "SET_ITEMS", payload: merged });
        if (guestItems.length) localStorage.removeItem("angela_guest_cart");
      });
    } else {
      if (guestItems.length) dispatch({ type: "SET_ITEMS", payload: guestItems });
    }
  }, [user?.id]);

  // Sync cart on every change
  const syncCart = useCallback(async (items: CartItem[]) => {
    if (user) {
      await supabase.from("carts").upsert({ user_id: user.id, items }, { onConflict: "user_id" });
    } else {
      localStorage.setItem("angela_guest_cart", JSON.stringify(items));
    }
  }, [user?.id]);

  useEffect(() => { syncCart(state.items); }, [state.items]);

  const subtotal    = Math.round(state.items.reduce((a, i) => a + i.unitPrice * (i.quantity / 100), 0));
  const deliveryFee = subtotal >= 7000 ? 0 : 450;

  return (
    <CartContext.Provider value={{
      items: state.items, isOpen: state.isOpen, itemCount: state.items.length,
      subtotal, deliveryFee, total: subtotal + deliveryFee,
      addItem:    (item) => dispatch({ type: "ADD_ITEM",    payload: item }),
      removeItem: (id)   => dispatch({ type: "REMOVE_ITEM", payload: id   }),
      updateQty:  (id, quantity) => dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }),
      clearCart:  ()     => dispatch({ type: "CLEAR_CART" }),
      openCart:   ()     => dispatch({ type: "OPEN_CART"  }),
      closeCart:  ()     => dispatch({ type: "CLOSE_CART" }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

