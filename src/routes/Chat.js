const express = require("express");
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');

const contact = require('../business/Objects').CONTACT;
const chat = require('../business/Objects').CHAT;

let userForChat = new Set();

router.get('/user/contacts', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    contact.getContactByOwnerId(userInfo._id).then(results => {
        if (results != null) {
            results.contacts.forEach(Element => {
                if (Element._id > results.ownerId) {
                    userForChat.add(Element._id + "-" + results.ownerId)
                } else {
                    userForChat.add(results.ownerId + "-" + Element._id)
                }
            })
        }
        res.status(200).send(results);
    }).catch(err => {
        res.status(400).send({
            error: err
        });
    });
});

router.delete('/user/contact', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    contact.deleteContact(
        userInfo._id
    ).then(results => {
        res.status(200).send(results);
    }).catch(err => {
        console.log(err);
        res.status(400).send({
            error: err
        });
    });
});

router.get('/user/chat/:contactID', userAuthenticated, (req, res) => {
    let chatBetween = "";
    const userInfo = req.user;
    const contactId = req.params.contactID;
    if (userInfo._id < contactId) {
        chatBetween = contactId + "-" + userInfo._id
    } else {
        chatBetween = userInfo._id + "-" + contactId
    }
    chat.getChat(chatBetween).then(results => {
        res.status(200).send(results);
    }).catch(err => {
        if (err) {
            console.log(err);
            res.status(400).send({
                error: err
            })
        }
    });
});

router.get('/user/chat/hasContactId/:subcontactId', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    const subcontactId = req.params.subcontactId;
    contact.getContactByOwnerIdAndSubContactId(userInfo._id, subcontactId).then(result => {
        return res.status(200).send({
            has: result ? true : false,
        })
    }).catch(err => {
        if (err) {
            return res.status(400).send({
                error: err
            })
        }
    });
});

router.post('/user/contact', userAuthenticated, (req, res) => {
    let contactBetween = "";
    const garageOwnerId = req.body.garageOwnerId;
    const stoteName = req.body.storeName;
    const userInfo = req.user;
    if (userInfo._id > garageOwnerId) {
        contactBetween = userInfo._id + "-" + garageOwnerId
    } else {
        contactBetween = garageOwnerId + "-" + userInfo._id
    }
    
    contact.updateContact({
        ownerId: userInfo._id,
        name: stoteName,
        otherUserId: garageOwnerId
    }).then(retrivedUserContact => {
        contact.updateContact({
            ownerId: garageOwnerId,
            name: userInfo.username,
            otherUserId: userInfo._id
        }).then(retrivedGarageOwnerContact => {
            chat.createChat({
                contactBetween
            }).then(CreatedChat => {
                userForChat.add(contactBetween)
                res.status(200).send({ created: true });
            }).catch(err => {
                res.status(400).send({
                    error: err
                });
            });
        }).catch(err => {
            res.status(400).send({
                error: err
            });
        });
    }).catch(err => {
        res.status(400).send({
            error: err
        });
    });
});

module.exports = {router, userForChat};