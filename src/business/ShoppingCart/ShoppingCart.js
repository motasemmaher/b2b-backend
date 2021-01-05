const ShoppingCartModel = require('../../models/model/ShoppingCart');

module.exports =  class ShoppingCart {
    constructor (ShoppingCart)
    {}

    createShoppingCart(shoppingCartInfo = {})
    {
        const promiseResult = ShoppingCartModel.createShoppingCart(shoppingCartInfo);
        return promiseResult;
    }

    updateShoppingCart(updatedShoppingCart)
    {
        const promiseResult = ShoppingCartModel.updateShoppingCart(updatedShoppingCart);
        return promiseResult;
    }

    deleteAllShoppingCart() {
        const result = ShoppingCartModel.deleteAllShoppingCart();
        return result;
    }

    deleteShoppingCart(shoppingCartId)
    {
        const promiseResult = ShoppingCartModel.deleteShoppingCart({_id: shoppingCartId});
        return promiseResult;
    }

    getShoppingCart(shoppingCartId)
    {
        const promiseResult = ShoppingCartModel.getShoppingCart({_id: shoppingCartId});
        return promiseResult;
    }

    addCartItem(shoppingCartId, cartItem) {
        const promiseResult = ShoppingCartModel.addCartItem({_id: shoppingCartId, cartItem: cartItem});
        return promiseResult;
    }

    removeCartItem(shoppingCartId, cartItemId) {
        const promiseResult = ShoppingCartModel.removeCartItem({_id: shoppingCartId, cartItemId: cartItemId});
        return promiseResult;
    }

    removeAllCartItem(shoppingCartId) {
        const promiseResult = ShoppingCartModel.removeAllCartItem({_id: shoppingCartId});
        return promiseResult;
    }
}
