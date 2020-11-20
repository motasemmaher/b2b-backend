const mongoose = require('mongoose');
const OrderSchema = require("../schema/Order");
const OrderModel= mongoose.model('Order', OrderSchema);

module.exports = {
    createOrder(value) {
        const result = OrderModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation Order"
            };
        }
    },

    updateOrder(value) {
        const result = OrderModel.findByIdAndUpdate({
            _id: value._id
        }, Order);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update Order"
            };
        }
    },

    deleteOrder(value) {
        const result = OrderModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete Order"
            };
        }
    },

    getOrder(value) {
        const result = OrderModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Order"
            };
    },

    deleteAllOrder() {
        const result = OrderModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all Orders"
            };
    }
};