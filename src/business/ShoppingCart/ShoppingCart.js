const ShoppingCartModel = require('../../models/model/ShoppingCart');

module.exports =  class ShoppingCart {

    constructor() {}

    createShoppingCart()
    {
        const promiseResult = ShoppingCartModel.createShoppingCart();
        return promiseResult;
    }

    deleteShoppingCart(cartId)
    {
        const promiseResult = ShoppingCartModel.deleteShoppingCart({_id:cartId});
        return promiseResult;
    }

}
