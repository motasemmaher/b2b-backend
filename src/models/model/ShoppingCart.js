const mongoose = require('mongoose')
const ShoppingCartSchema = require("../schema/ShoppingCart");

const ShoppingCartModel= mongoose.model('ShoppingCart', ShoppingCartSchema);

module.exports = {
    insert: function (newShoppingCart) {  
        const result = ShoppingCartModel.create(newShoppingCart);
        if(result)
            return result;
        else
            return {error:"Error with the creation ShoppingCart"};
    },

    update: function (ShoppingCart) {  
        const result = ShoppingCartModel.findByIdAndUpdate({_id: ShoppingCart._id}, ShoppingCart);
        if(result)
            return result;
        else
            return {error:"Error with the update ShoppingCart"};
    },

    delete: function (ShoppingCart) {  
        const result = ShoppingCartModel.findOneAndDelete({_id: ShoppingCart._id}).then(()=> console.log("Deleted shoppingcart")).catch(()=>console.log("Error with deleting shoppingcart"));
        if(result)
            return result;
        else
            return {error:"Error with the deletion ShoppingCart"};
    }
};