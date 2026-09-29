export function addToCart(cart, product) {
    const existingItem = cart.find((item) => item.productId === product.productId);
    if (existingItem) {
        return cart.map((item) => item.productId === product.productId
            ? {
                ...item,
                quantity: item.quantity + 1,
            }
            : item);
    }
    return [
        ...cart,
        {
            ...product,
            quantity: 1,
        },
    ];
}
export function removeFromCart(cart, productId) {
    return cart.filter((item) => item.productId !== productId);
}
export function updateQuantity(cart, productId, quantity) {
    if (quantity <= 0) {
        return removeFromCart(cart, productId);
    }
    return cart.map((item) => item.productId === productId
        ? {
            ...item,
            quantity,
        }
        : item);
}
export function calculateSubtotal(cart) {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
