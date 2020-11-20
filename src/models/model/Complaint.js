const mongoose = require('mongoose')
const ComplaintSchema = require("../schema/Complaint");

const ComplaintModel = mongoose.model('Complaint', ComplaintSchema);

module.exports = 
{

    createComplaint(value)
    {
        const result = ComplaintModel.create({message:value.message,garageId:value.garageId});
        if(result)
        return result;
        else
        return {error:"Error with the creation Complaint"};  
    }

}