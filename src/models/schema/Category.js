const Product = require('./Product');
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Category = new schema({
    name: {type: String,required: true},
    image: {type: String,required: true},
    storeId: {type: String,required: true},
    products: [Product]
})

module.exports = Category;
