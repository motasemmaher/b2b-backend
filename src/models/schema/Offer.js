const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Offer = new schema({
   discountRate:Number,
   duration:String
})

module.exports = Offer;
