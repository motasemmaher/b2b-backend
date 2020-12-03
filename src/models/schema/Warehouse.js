const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Warehouse = new schema({
    storeId: {
        type: schema.Types.ObjectId,
        ref: 'Store'
    },
    storage: [{
        productId: {
            type: schema.Types.ObjectId,
            ref: 'Product'
        },
        categoryId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            min: 0,
            required: true,
            default: 0
        }
    }]
})

module.exports = Warehouse;