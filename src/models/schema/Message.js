const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Message = new schema({
    owner:{type:String,require:true},
    data:{type:String,require:true,minlength: 2,maxlength: 512},
    date:{type:Date,default:Date.now}
})

module.exports = Message;
