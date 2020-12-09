const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Offer = new schema({
   discountRate:{type: Number,require: true,minlength: 1,maxlength: 3},
   duration:{type: Number,require: true,minlength: 1,maxlength: 3},
   newPrice:{type: Number,require: true},
   expirationDate:{type: Date,require: true}
})

module.exports = Offer;
