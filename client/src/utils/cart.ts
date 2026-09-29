import type { CartItem } from "@/types/cart";

export function addToCart(
  cart: CartItem[],
  product: Omit<CartItem, "quantity">
): CartItem[] {
  const existingItem = cart.find(
    (item) => item.productId === product.productId
  );

  if (existingItem) {
    return cart.map((item) =>
      item.productId === product.productId
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );
  }

  return [
    ...cart,
    {
      ...product,
      quantity: 1,
    },
  ];
}

export function removeFromCart(
  cart: CartItem[],
  productId: number
): CartItem[] {
  return cart.filter(
    (item) => item.productId !== productId
  );
}

export function updateQuantity(
  cart: CartItem[],
  productId: number,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }

  return cart.map((item) =>
    item.productId === productId
      ? {
          ...item,
          quantity,
        }
      : item
  );
}

export function calculateSubtotal(
  cart: CartItem[]
): number {
  return cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );
}