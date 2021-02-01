//Requiring the necessay files, middlewares and packages
const express = require("express");
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');
//Requiring the necessary objects
const complaint = require('../business/Objects').COMPLAINT;
const store = require('../business/Objects').STORE;
const user = require('../business/Objects').USER;
const message = require('../business/Objects').MESSAGE;

//----------View Complaints and View Complaint----------
router.get('/view-complaints/:complaintId?',userAuthenticated,(req,res) => {
    const loggedUser = req.user;
    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //Checking if complaintId was provided in the url
    //If it did, then get the complaint by id
    if(req.params.complaintId != null && (loggedUser.role ==="admin"||loggedUser.role==="garageOwner"))
    {
        //Getting complaint
        complaint.getComplaint(req.params.complaintId)
        .then(complaintResult => {
        //If the complaint doesn't exist, return error response
        if(complaintResult == null)
            return res.status(404).send({error:"Error! Didn't find a complaint with that id."});
        //If the complaint exists, return successful response
        else
            return res.status(200).send(complaintResult);
        })
        //If getting complaint by id runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error getting the complaint. "+err})});
    }
    //If the logged user is admin, then return all the complaint
    else if(loggedUser.role === 'admin')
    {
        //Getting all complaints
        complaint.getAllComplaints(limit,skip)
        .then(complaintResult => {
            //Gettign count of all complaints
            complaint.countAllComplaints()
            .then(countResult => {
            //Returning successful response
            return res.status(200).send({count:countResult,complaints:complaintResult});
            })
            //If getting count runs into error, return error response
            .catch(err => {return res.status(500).send({error:"Error getting the count of all complaints. "+err})});
        })
        //If getting complaints runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error getting all complaints. "+err})});
    }
    //If the logged user is garageOwner, then return all the complaints of that user
    else if(loggedUser.role === 'garageOwner')
    {
        //Getting the garageOwner's complaints
        complaint.getGarageOwnerComplaints(loggedUser._id,limit,skip)
        .then(complaintResult => {
        //Getting count of the garageOwner's complaints
        complaint.countByGarageOwner(loggedUser._id)
            .then(countResult => {
            //Returning successful response
            return res.status(200).send({count:countResult,complaints:complaintResult});
            })
            //If getting count runs into error, return error response
            .catch(err => {return res.status(500).send({error:"Error getting the count of garageOwner's complaints. "+err})});
            })
        //If getting complaints runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error getting the garageOwner's complaints. "+err})});
    }
    //If the user role doesn't match any of the authorized roles
    else
        return res.status(401).send({error:"Error, the user isn't allowed to view the complaints."});
});
//----------Create Complaint----------
router.post('/stores/:storeId/create-complaint',userAuthenticated,(req,res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response
    const loggedUser = req.user;
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    //Checking if the request body id empty or not, if it is then return error response
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    //Checking if the provided storeId exists
    const storeId = req.params.storeId;
    store.exists(storeId)
    .then(storeResult => {
    //If it doesn't exist, return error response
    if(!storeResult)
        return res.status(404).send({error:"Error! Didn't find a store with that id."});
    //Checking if the logged user id exists
    user.exists(loggedUser._id)
        .then(getUserResult => {
        //If it doesn't exist, return error response
        if(!getUserResult)
            return res.status(404).send({error:"Error! Didn't find a user with that is."})
        //Storing then validating the data from the request body
        messageBody = req.body.message;
        const messageValidationResult = message.validateMessageInfo({data:messageBody});
        if(typeof messageValidationResult !== 'undefined')
            return res.status(400).send({error:messageValidationResult.error});
        //Creatign message
        message.createMessage(loggedUser._id,messageBody)
            .then(messageResult => {
            //Creating complaint
            complaint.createComplaint(loggedUser._id,messageResult,storeResult.userId,storeId)
                .then(complaintResult => {
                //Returning successful response
                return res.status(200).send(complaintResult);
                })
                //If craeting complaint runs into error, return error response
                .catch(err => {return res.status(500).send({error:"Error creating the complaint. "+err})});
            })
            //If creating message runs into error, return error response
            .catch(err => {return res.status(500).send({error:"Error creating the message. "+err})});
        })
        //If getting user by id runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error getting the user. "+err})});    
    })
    //If getting store by id runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error getting the store. "+err})});
});
//Exporting the route
module.exports = router;