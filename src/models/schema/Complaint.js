const mongoose = require('mongoose');
const Message = require('./Message');

const schema = mongoose.Schema;

const Complaint = new schema({
    message:Message,
    garageId:String
})

module.exports = Complaint;
