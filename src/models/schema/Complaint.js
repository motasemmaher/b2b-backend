const mongoose = require('mongoose');
//const Message = require('./Message');

const schema = mongoose.Schema;

const Complaint = new schema({
    submitterId:{
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    message:{
        type: schema.Types.ObjectId,
        ref: 'Message'
    },
    garageOwnerId:{
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    garageId:{
        type: schema.Types.ObjectId,
        ref: 'Store'
    }
})  

module.exports = Complaint;
