const Offer = require('./Offer');
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Product = new schema({
    name: {type: String,required: true},
    price: {type: Number,required: true},
    image: {type: String,required: true},
    categoryId: {
        type: schema.Types.ObjectId,
        ref: 'Category'
    },
    productType: {type: String,required: true, enum: ["Part", "Accessory", "Service"]},
    description: {type: String,required: true},
    offer: {
        type: schema.Types.ObjectId,
        ref: 'Offer'
    },
    isInStock:{
        type:Boolean,
        required:true,
        default:true
    }
    ,
    tags : [{type:String,required:true}]
})

module.exports = Product;