const ComplaintModel = require("../../models/model/Complaint");

module.exports = class Complaint {

    constructor() {}

    countAllComplaints()
    {
        const promiseResult = ComplaintModel.countAllComplaints({});
        return promiseResult;
    }

    countByGarageOwner(garageOwnerId)
    {
        const promiseResult = ComplaintModel.countByGarageOwner({garageOwnerId:garageOwnerId});
        return promiseResult;
    }

    createComplaint(submitterId,message,garageOwnerId,storeId)
    {
        const complaintPromise = ComplaintModel.createComplaint({submitterId:submitterId,message:message,garageOwnerId:garageOwnerId,storeId:storeId});
        return complaintPromise;
    }

    getAllComplaints(limit,skip)
    {
        const complaintPromise = ComplaintModel.findAllComplaints({limit:limit,skip:skip});
        return complaintPromise;
    }

    getComplaint(complaintId)
    {
        const complaintPromise = ComplaintModel.findComplaint({complaintId:complaintId});
        return complaintPromise;
    }

    getGarageOwnerComplaints(garageOwnerId,limit,skip)
    {
        const complaintPromise = ComplaintModel.findGarageOwnerComplaints({garageOwnerId:garageOwnerId,limit:limit,skip:skip});
        return complaintPromise;
    }
}