const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Offer = new schema({
   discountRate:{type:Number,require:true},
   duration:{type:Number,require:true},
   newPrice:{type:Number,require:true},
   expirationDate:{type:Date,require:true}
   //expirationDate:{type:String,require:true}
})

module.exports = Offer;
