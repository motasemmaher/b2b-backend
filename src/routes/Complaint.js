const express = require("express");
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');
const limitAndSkipValidation = require('./src/validations/limitAndSkipValidation');
const bodyParser = require('body-parser');

//Setting-up req body parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

const Complaint = require('../business/Complaint/Complaint');
const complaint = new Complaint();

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
            res.status(404).send({error:"Error! Didn't find a complaint with that id."});
        else
            res.status(200).send(complaintResult);
        })
        .catch(err => res.status(404).send({error:"Error getting the complaint. "+err}));
    }
    else if(loggedUser.role === 'admin')
    {
        complaint.getAllComplaints(limit,skip)
        .then(complaintResult => {
        complaint.countAllComplaints()
            .then(countResult => {
            res.send({count:countResult,complaints:complaintResult});
            })
            .catch(err => res.send({error:"Error getting the count of all complaints. "+err}));
        })
        .catch(err => res.send({error:"Error getting all complaints. "+err}));
    }
    else if(loggedUser.role === 'garageOwner')
    {
        complaint.getGarageOwnerComplaints(loggedUser._id,limit,skip)
        .then(complaintResult => {
        complaint.countByGarageOwner(loggedUser._id)
        .then(countResult => {
        res.send({count:countResult,complaints:complaintResult});
        })
        .catch(err => res.send({error:"Error getting the count of garageOwner's complaints. "+err}));
        })
        .catch(err => res.send({error:"Error getting the garageOwner's complaints. "+err}));
    }
    else
        res.send({error:"Error, the user isn't allowed to view the complaints."});
});
//----------Create Complaint----------
router.post('/stores/:storeId/create-complaint',userAuthenticated,(req,res) => {
    const loggedUser = req.user;
    const storeId = req.params.storeId;

    if(loggedUser.role !== "carOwner")
        res.send({error:"Unauthorized user !"});
    else
    {
        store.exists(storeId)
        .then(storeResult => {
        if(storeResult == null)
            res.send({error:"Error! Didn't find a store with that id."});
        else
        {
            user.exists(loggedUser._id)
            .then(getUserResult => {
                if(getUserResult == null)
                    res.send({error:"Error! Didn't find a user with that is."})
                else
                {
                    messageBody = req.body.message;
                    const messageValidationResult = message.validateMessageInfo({data:messageBody});
                    if(typeof messageValidationResult !== 'undefined')
                        res.send(messageValidationResult.err);
                    else
                    {
                        message.createMessage(loggedUser._id,messageBody)
                        .then(messageResult => {
                        complaint.createComplaint(loggedUser._id,messageResult,storeResult.userId,storeId)
                            .then(complaintResult => {
                            res.send(complaintResult);
                            //res.redirect('/store/'+req.params.id);
                            })
                        .catch(err => res.send({error:"Error creating the complaint. "+err}));
                        })
                        .catch(err => res.send({error:"Error creating the message. "+err}));
                    }
                }
            })
            .catch(err => res.send({error:"Error getting the user. "+err}));    
        }
        })
        .catch(err => res.send({error:"Error getting the store. "+err}));
    }
});


module.exports = router;