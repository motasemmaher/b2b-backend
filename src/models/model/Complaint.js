const mongoose = require('mongoose')
const ComplaintSchema = require("../schema/Complaint");

const ComplaintModel = mongoose.model('Complaint', ComplaintSchema);

module.exports = 
{

    countAllComplaints()
    {
        const count = ComplaintModel.countDocuments({});
        return count;
    }
    ,
    countByGarageOwner(value)
    {
        const count = ComplaintModel.countDocuments({ garageOwnerId: value.garageOwnerId });
        return count;
    }
    ,
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
        const result = ComplaintModel.find({garageOwnerId:value.garageOwnerId}).skip(value.skip).limit(value.limit)
        .populate('submitterId','fullName')
        .populate('message','data')
        .populate('garageOwnerId','fullName')
        .populate('garageId','name')
        .exec();
        if(result)
        return result;
        else
        return {error:"Error with finding the garageOwner's complaints"};  
    }
    ,
    findAllComplaints(value)
    {
        const result = ComplaintModel.find({}).skip(value.skip).limit(value.limit)
        .populate('submitterId','fullName')
        .populate('message','data')
        .populate('garageOwnerId','fullName')
        .populate('garageId','name')
        .exec();
        if(result)
        return result;
        else
        return {error:"Error with finding all complaints"};  
    }
    ,
    //FOR TESTING
    deleteComplaint(value)
    {
        const result = ComplaintModel.findOneAndDelete({_id:value._id}).then().catch();
        if(result)
            return result;
        else
        return {error:"Error with the delete Complaint"}; 
    }
}