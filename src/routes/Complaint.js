const express = require("express");
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');

const complaint = require('../business/Objects').COMPLAINT;
const store = require('../business/Objects').STORE;
const user = require('../business/Objects').USER;
const message = require('../business/Objects').MESSAGE;

//----------View Complaints and View Complaint----------
router.get('/view-complaints/:complaintId?',userAuthenticated,(req,res) => {
    const loggedUser = req.user;

    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    if(req.params.complaintId != null)
    {
        complaint.getComplaint(req.params.complaintId)
        .then(complaintResult => {
        if(complaintResult == null)
            return res.status(404).send({error:"Error! Didn't find a complaint with that id."});
        else
            return res.status(200).send(complaintResult);
        })
        .catch(err => {return res.status(500).send({error:"Error getting the complaint. "+err})});
    }
    else if(loggedUser.role === 'admin')
    {
        complaint.getAllComplaints(limit,skip)
        .then(complaintResult => {
            complaint.countAllComplaints()
            .then(countResult => {
            return res.status(200).send({count:countResult,complaints:complaintResult});
            })
            .catch(err => {return res.status(500).send({error:"Error getting the count of all complaints. "+err})});
        })
        .catch(err => {return res.status(500).send({error:"Error getting all complaints. "+err})});
    }
    else if(loggedUser.role === 'garageOwner')
    {
        complaint.getGarageOwnerComplaints(loggedUser._id,limit,skip)
        .then(complaintResult => {
        complaint.countByGarageOwner(loggedUser._id)
        .then(countResult => {
        return res.status(200).send({count:countResult,complaints:complaintResult});
        })
        .catch(err => {return res.status(500).send({error:"Error getting the count of garageOwner's complaints. "+err})});
        })
        .catch(err => {return res.status(500).send({error:"Error getting the garageOwner's complaints. "+err})});
    }
    else
        return res.status(401).send({error:"Error, the user isn't allowed to view the complaints."});
});
//----------Create Complaint----------
router.post('/stores/:storeId/create-complaint',userAuthenticated,(req,res) => {
    const loggedUser = req.user;
    const storeId = req.params.storeId;

    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});

    store.exists(storeId)
    .then(storeResult => {
    if(!storeResult)
        return res.status(404).send({error:"Error! Didn't find a store with that id."});
    
    user.exists(loggedUser._id)
        .then(getUserResult => {
        if(!getUserResult)
            return res.status(404).send({error:"Error! Didn't find a user with that is."})
        
        messageBody = req.body.message;
        const messageValidationResult = message.validateMessageInfo({data:messageBody});
        if(typeof messageValidationResult !== 'undefined')
            return res.status(400).send({error:messageValidationResult.error});
       
        message.createMessage(loggedUser._id,messageBody)
            .then(messageResult => {
            complaint.createComplaint(loggedUser._id,messageResult,storeResult.userId,storeId)
                .then(complaintResult => {
                return res.status(200).send(complaintResult);
                })
                .catch(err => {return res.status(500).send({error:"Error creating the complaint. "+err})});
            })
            .catch(err => {return res.status(500).send({error:"Error creating the message. "+err})});
        })
        .catch(err => {return res.status(500).send({error:"Error getting the user. "+err})});    
    })
    .catch(err => {return res.status(500).send({error:"Error getting the store. "+err})});
});

module.exports = router;