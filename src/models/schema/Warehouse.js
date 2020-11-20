const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Warehouse = new schema({
    storeId: {type: String},
    storage: [{
        productId: {
            type: String,
            required: true
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