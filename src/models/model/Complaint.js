const mongoose = require('mongoose')
const ComplaintSchema = require("../schema/Complaint");
const ComplaintModel = mongoose.model('Complaint', ComplaintSchema);
const MessageModel = require('./Message');

module.exports = class Complaint
{
    static createComplaint(res,value)
    {
        console.log(value.message);
        ComplaintModel.create({message:value.message,garageId:value.garageId})
                      .then(result => res.send("Created Complaint"))
                      .catch(err => res.send("Error with the creation Complaint"));
    }
}