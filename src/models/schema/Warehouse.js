const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Warehouse = new schema({

    storage: [{
        productId: {
            type: schema.Types.ObjectId,
            ref: 'Product'
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