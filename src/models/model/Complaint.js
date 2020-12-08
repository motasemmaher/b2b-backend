const mongoose = require('mongoose')
const ComplaintSchema = require("../schema/Complaint");

const ComplaintModel = mongoose.model('Complaint', ComplaintSchema);

module.exports = 
{

    createComplaint(value)
    {
        const result = ComplaintModel.create({submitterId:value.submitterId,message:value.message,garageOwnerId:value.garageOwnerId,garageId:value.storeId});
        if(result)
        return result;
        else
        return {error:"Error with the creation Complaint"};  
    }
    ,
    findComplaint(value)
    {
        const result = ComplaintModel.findById({_id:value.complaintId})
        .populate('submitterId').populate('message').populate('garageOwnerId').populate('garageId').exec();;
        if(result)
        return result;
        else
        return {error:"Error with finding the complaint"};  
    }
    ,
    findGarageOwnerComplaints(value)
    {
        //const result = ComplaintModel.find({garageOwnerId:value.garageOwnerId}).populate('submitterId').populate('message').populate('garageId').exec();;
        const result = ComplaintModel.find({garageOwnerId:value.garageOwnerId})
        .populate('submitterId','fullName')
        .populate('message','messageBody')
        .populate('garageOwnerId','fullName')
        .populate('garageId','name')
        .exec();
        if(result)
        return result;
        else
        return {error:"Error with finding the garageOwner's complaints"};  
    }
    ,
    findAllComplaints()
    {
        //const result = ComplaintModel.find({}).populate('submitterId').populate('message').populate('garageOwnerId').populate('garageId').exec();
        const result = ComplaintModel.find({}).lean()
        .populate('submitterId','fullName')
        .populate('message','messageBody')
        .populate('garageOwnerId','fullName')
        .populate('garageId','name')
        .exec();
        if(result)
        return result;
        else
        return {error:"Error with finding all complaints"};  
    }
}