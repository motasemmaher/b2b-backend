const mongoose = require('mongoose');
const Message = require('./Message');

const schema = mongoose.Schema;

const Complaint = new schema({
    message:{
        type: schema.Types.ObjectId,
        ref: 'Message'
    },
    garageId:String
})

module.exports = Complaint;
