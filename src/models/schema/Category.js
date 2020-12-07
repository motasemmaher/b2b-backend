const Product = require('./Product');
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Category = new schema({
    name: {type: String,required: true},
    image: {type: String,required: true},
    storeId: {
        type: schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    products: [{
        type: schema.Types.ObjectId,
        ref: 'Product'
    }],
    tags : [{type:String,required:true}]
})

module.exports = Category;
