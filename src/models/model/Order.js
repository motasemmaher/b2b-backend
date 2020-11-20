const mongoose = require('mongoose')
const OrderSchema = require("../schema/Order");

const OrderModel= mongoose.model('Order', OrderSchema);

module.exports = {
    insert: function (newOrder) {  
        const result = OrderModel.create(newOrder);
        if(result)
            return result;
        else
            return {error:"Error with the creation Order"};
    },

    update: function (Order) {  
        const result = OrderModel.findByIdAndUpdate({_id: Order._id}, Order);
        if(result)
            return result;
        else
            return {error:"Error with the update Order"};
    },

    delete: function (Order) {  
        const result = OrderModel.findOneAndDelete({_id: Order._id});
        if(result)
            return result;
        else
            return {error:"Error with the deletion Order"};
    }
};