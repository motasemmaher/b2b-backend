const ComplaintModel = require("../../models/model/Complaint");

module.exports = class Complaint {

    constructor() {}

    createComplaint(submitterId,message,garageOwnerId,storeId)
    {
        const complaintPromise = ComplaintModel.createComplaint({submitterId:submitterId,message:message,garageOwnerId:garageOwnerId,storeId:storeId});
        return complaintPromise;
    }

    getAllComplaints()
    {
        const complaintPromise = ComplaintModel.findAllComplaints();
        return complaintPromise;
    }

    getComplaint(complaintId)
    {
        const complaintPromise = ComplaintModel.findComplaint({complaintId:complaintId});
        return complaintPromise;
    }

    getGarageOwnerComplaints(garageOwnerId)
    {
        const complaintPromise = ComplaintModel.findGarageOwnerComplaints({garageOwnerId:garageOwnerId});
        return complaintPromise;
    }
}