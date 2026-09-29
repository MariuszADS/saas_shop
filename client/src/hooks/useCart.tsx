import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CartItem } from "@/types/cart";
import {
  addToCart,
  calculateSubtotal,
  removeFromCart,
  updateQuantity,
} from "@/utils/cart";

interface CartContextValue {
  cart: CartItem[];
  subtotal: number;
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addItem(
    product: Omit<CartItem, "quantity">
  ) {
    setCart((currentCart) =>
      addToCart(currentCart, product)
    );
  }

  function removeItem(productId: number) {
    setCart((currentCart) =>
      removeFromCart(currentCart, productId)
    );
  }

  function setQuantity(
    productId: number,
    quantity: number
  ) {
    setCart((currentCart) =>
      updateQuantity(
        currentCart,
        productId,
        quantity
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  const subtotal = useMemo(
    () => calculateSubtotal(cart),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        subtotal,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}