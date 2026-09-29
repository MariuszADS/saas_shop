export function createCheckoutPayload(cart) {
    return {
        items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
        })),
    };
}
