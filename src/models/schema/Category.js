const Product = require('./Product');
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Category = new schema({
    name: {type: String,required: true,minlength: 2,maxlength: 64},
    storeId: {
        type: schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    products: [{
        type: schema.Types.ObjectId,
        ref: 'Product'
    }],
    tags : [{type: String,required: true}]
})

module.exports = Category;
