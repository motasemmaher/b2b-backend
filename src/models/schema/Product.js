const Offer = require('./Offer');
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Product = new schema({
    name: {type: String,required: true},
    price: {type: Number,required: true,},
    image: {type: String,required: true},
    categoryId: {type: String,required: true},
    productType: {type: String,required: true,enum: ["Part", "Accessory", "Service"]},
    description: {type: String,required: true},
    offer: Offer
})

module.exports = Product;