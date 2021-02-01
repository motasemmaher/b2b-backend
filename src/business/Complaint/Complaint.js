//Requiring the necessary files and models
const ComplaintModel = require("../../models/model/Complaint");
//Exporting the class
module.exports = class Complaint {

    constructor() {}
    //A method to get the count of all the complaints in the database
    countAllComplaints()
    {
        const promiseResult = ComplaintModel.countAllComplaints({});
        return promiseResult;
    }
    //A method to get the count of the complaints of a specific garageOwner in the database
    countByGarageOwner(garageOwnerId)
    {
        const promiseResult = ComplaintModel.countByGarageOwner({garageOwnerId:garageOwnerId});
        return promiseResult;
    }
    //A method to create a complaint
    createComplaint(submitterId,message,garageOwnerId,storeId)
    {
        const complaintPromise = ComplaintModel.createComplaint({submitterId:submitterId,message:message,garageOwnerId:garageOwnerId,storeId:storeId});
        return complaintPromise;
    }
    //A method to get all the complaints stored in the database
    getAllComplaints(limit,skip)
    {
        const complaintPromise = ComplaintModel.findAllComplaints({limit:limit,skip:skip});
        return complaintPromise;
    }
    //A method to get a complaint from the database by its ID
    getComplaint(complaintId)
    {
        const complaintPromise = ComplaintModel.findComplaint({complaintId:complaintId});
        return complaintPromise;
    }
    //A method to get the complaints of a garageOwner stored in the database
    getGarageOwnerComplaints(garageOwnerId,limit,skip)
    {
        const complaintPromise = ComplaintModel.findGarageOwnerComplaints({garageOwnerId:garageOwnerId,limit:limit,skip:skip});
        return complaintPromise;
    }
    //A method to delete a complaint
    deleteComplaint(complaintId)
    {
        const complaintPromise = ComplaintModel.deleteComplaint({_id:complaintId});
        return complaintPromise;
    }
}