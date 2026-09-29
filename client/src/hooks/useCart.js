import { createContext, useContext, useMemo, useState, } from "react";
import { addToCart, calculateSubtotal, removeFromCart, updateQuantity, } from "@/utils/cart";
const CartContext = createContext(undefined);
export function CartProvider({ children, }) {
    const [cart, setCart] = useState([]);
    function addItem(product) {
        setCart((currentCart) => addToCart(currentCart, product));
    }
    function removeItem(productId) {
        setCart((currentCart) => removeFromCart(currentCart, productId));
    }
    function setQuantity(productId, quantity) {
        setCart((currentCart) => updateQuantity(currentCart, productId, quantity));
    }
    function clearCart() {
        setCart([]);
    }
    const subtotal = useMemo(() => calculateSubtotal(cart), [cart]);
    return (<CartContext.Provider value={{
            cart,
            subtotal,
            addItem,
            removeItem,
            setQuantity,
            clearCart,
        }}>
      {children}
    </CartContext.Provider>);
}
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }
    return context;
}
