const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Warehouse = new schema({
    storeId: {type: String,unique: true,required: true},
    storage: [{
        productId: {
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