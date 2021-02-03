//Requiring the necessary files and models
const CartItemModel = require('../../models/model/CartItem');

module.exports = class CartItem {
    constructor(cartItem) {}

    createCartItem(cartItemInfo = {}) {
        const result = CartItemModel.createCartItem(cartItemInfo);
        return result;
    }

    updateCartItem(updatedCartItem) {
        const result = CartItemModel.updateCartItem(updatedCartItem);
        return result;
    }

    deleteCartItem(cartItemId) {
        const result = CartItemModel.deleteCartItem(cartItemId);
        return result;
    }

    deleteAllCartItemsAssociatedWithShoppingCartId(shoppingCartId) {
        const result = CartItemModel.deleteAllCartItemsAssociatedWithShoppingCartId({
            shoppingCartId: shoppingCartId
        });

        return result;
    }

    getCartItem(cartItemId) {
        const result = CartItemModel.getCartItem({_id: cartItemId});
        return result;
    }

    getCartItemsAssociatedWithShoppingCartId(shoppingCartId, limit, skip) {
        const result = CartItemModel.getCartItemsAssociatedWithShoppingCartId({
            shoppingCartId: shoppingCartId,
            limit: limit,
            skip: skip
        });

        return result;
    }

    getCartItemAssociatedWithShoppingCartId(shoppingCartId, cartItemId) {
        const result = CartItemModel.getCartItemAssociatedWithShoppingCartId({
            _id: cartItemId,
            shoppingCartId: shoppingCartId
        });
        return result;
    }

    deleteAllCartItem() {
        const result = CartItemModel.deleteAllCartItem();
        return result;
    }

}