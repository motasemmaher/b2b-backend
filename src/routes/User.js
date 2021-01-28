const express = require('express');
const router = express.Router();
const { userAuthenticated } = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');
const nodemailer = require('nodemailer');

const user = require('../business/Objects').USER;
const garageOwner = require('../business/Objects').GARAGEOWNER;
const carOwner = require('../business/Objects').CAROWNER;
const store = require('../business/Objects').STORE;
const category = require('../business/Objects').CATEGORY;
const product = require('../business/Objects').PRODUCT;
const menu = require('../business/Objects').MENU;
const warehouse = require('../business/Objects').WAREHOUSE;


const hrTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'b2b.hr.department@gmail.com',
        pass: 'b2bgp2020'
    }
});

//----------Get waiting users----------
router.get('/admin/waiting-users', userAuthenticated, (req, res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        return res.status(401).send({error:"Unauthorized user !"});
    else
    {
        let skip = req.query.skip;
        let limit = req.query.limit;
        const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
        skip = limitAndSkipValues.skip;
        limit = limitAndSkipValues.limit;

        user.getAllUsersIdOfARole('waitingUser')
        .then(ids => {
        garageOwner.getWaitingUsers(ids,limit,skip)
            .then(waitingUsersResult => {
            user.countByRole('waitingUser')
                .then(countResult => {
                 return res.status(200).send({count:countResult,waitingUsers:waitingUsersResult});
                })
                .catch(err => {return res.status(500).send({error:"Error getting the count of waiting users. "+err})})
            })
            .catch(err => {return res.status(500).send({error:"Error getting the waiting users. "+err})});
        })
        .catch(err => {return res.status(500).send({error:"Error getting the users of that role. "+err})});
    }
});
//----------View users----------
router.get('/admin/view-users/:userId', userAuthenticated, (req, res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        return res.status(401).send({error:"Unauthorized user !"});
    else
    {
        if(req.params.userId == null)
        {
            let skip = req.query.skip;
            let limit = req.query.limit;
            const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
            skip = limitAndSkipValues.skip;
            limit = limitAndSkipValues.limit;

            user.getAllUsersIdOfARole('garageOwner')
            .then(ids => {
            garageOwner.getAllGarageOwners(ids,limit,skip)
                .then(garageOwnersResult => {
                carOwner.getAllCarOwners(limit,skip)
                    .then(carOwnersResult => {
                    user.countAll()
                        .then(countResult => {
                            return res.status(200).send({count:countResult,garageOwners:garageOwnersResult,carOwners:carOwnersResult});
                        })
                        .catch(err => {return res.status(500).send({error:"Error getting the count of users. "+err})});
                    })
                    .catch(err => {return res.status(500).send({error:"Error getting the carOwners. "+err})});
                })  
                .catch(err => {return res.status(500).send({error:"Error getting the garageOwners. "+err})});
            })
            .catch(err => {return res.status(500).send({error:"Error getting the users of that role. "+err})});
        }
        else {
            user.exists(req.params.userId)
            .then(existResult => {
            if(existResult == null)
                return res.status(404).send({error:"Error! Didn't find a user with that id."});
            else
            {
                garageOwner.getGarageOwnerByUserId(req.params.userId).populate("stores")
                .then(garageOwnerResult => {
                if(garageOwnerResult != null)
                {
                    user.getUserById(req.params.userId)
                    .then(getUserResult => {
                        return res.status(200).send({user:getUserResult,garageOwnerInfo:garageOwnerResult})
                    })
                    .catch(err => {return res.status(500).send({error:"Error with getting user with that user id."+err})});
                }
                else
                {
                    carOwner.getCarOwnerByUserId(req.params.userId).populate("cars")
                    .then(carOwnerResult => {
                    if(carOwnerResult != null)
                    {
                        user.getUserById(req.params.userId)
                        .then(getUserResult => {
                            return res.status(200).send({user:getUserResult,carOwnerInfo:carOwnerResult})
                        })
                        .catch(err => {return res.status(500).send({error:"Error with getting user with that user id."+err})});
                    }
                    else
                        return res.status(404).send({error:"Error ! Didn't find a garageOwner or a carOwner with that user id."});
                    })
                    .catch(err => {return res.status(500).send({error:"Error with getting carOwner with that user id."+err})});
                }
                })
                .catch(err => {return res.status(500).send({error:"Error with getting garageOwner with that user id."+err})});
            }
            })
            .catch(err => {return res.status(500).send({error:"Error with checking if the user exists. "+err})});
        }
    }
});
//----------Accepting waiting user----------
router.put('/admin/waiting-users/accept/:userId', userAuthenticated, (req, res) => {
    loggedUser = req.user;
    if (Object.keys(req.body).length === 0)
        return res.status(400).send({ error: "No data was sent!" });
    if (loggedUser.role !== "admin")
        return res.status(401).send({ error: "Unauthorized user !" });
    else {
        userId = req.params.userId;
        user.exists(userId)
        .then(getUserResult => {
            if(getUserResult == null)
                return res.status(404).send({error:"Error! Didn't find a user with that id."});
            else
            {
                user.acceptWaitingUser(userId)
                .then(acceptanceResult => {
                var mailOptions = {
                    from: 'b2b.hr.department@gmail.com',
                    to: acceptanceResult.email,
                    subject: `Regestration Acceptance`,
                    text: `Hello ${acceptanceResult.fullName},we are glad to inform you that your account as a garage owner has been approved.
                    \nNow you can log into your account. We hope that you will enjoy using our website.
                    \nFor more information, contact us (+962) 792924975 or at b2b.hr.department@gmail.com.
                    \nRegards, b2b development team`,
                };
                hrTransporter.sendMail(mailOptions, function(error, info){
                if (error)
                    console.log(error);
                else
                    console.log('Email sent: ' + info.response); 
                user.getUserById(acceptanceResult._id)
                    .then(acceptedUserResult => {
                        return res.status(200).send(acceptedUserResult);
                    })
                    .catch(err => {return res.status(500).send({error:"Error with getting the accepted . "+err})});
                });  
                })
                .catch(err => {return res.status(500).send({error:"Error accepting the waiting user. "+err})});
            }
        })
        .catch(err => {return res.status(500).send({error:"Error getting user with that id. "+err})});
    }
});
//----------Rejecting waiting user----------
router.delete('/admin/waiting-users/reject/:userId', userAuthenticated, (req, res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        return res.status(401).send({error:"Unauthorized user !"});
    else
    {
        userId = req.params.userId;
        user.exists(userId)
        .then(getUserResult => {
            if(getUserResult == null)
                return res.status(404).send({error:"Error! Didn't find a user with that id."});
            else
            {
                user.deleteUser(userId)
                .then(deletingUserResult => {
                garageOwner.deleteGarageOwnerByUserId(userId)
                    .then(deletingGarageOwnerResult => {
                    store.getStoresByUserId(userId)
                        .then(storeIds => {
                        menu.deleteMenuByStoreId(storeIds)
                            .then(deleteMenuResult => {
                            warehouse.deleteWarehouseByStoreId(storeIds)
                                .then(deleteWarehouseResult => {
                                store.deleteStoreByUserId(userId)
                                    .then(deletingStoresResult => {
                                    var mailOptions = {
                                        from: 'b2b.hr.department@gmail.com',
                                        to: deletingUserResult.email,
                                        subject: `Regestration rejection`,
                                        text: `Hello ${deletingUserResult.fullName},we are sad to inform you that your request to create a garageowner account on b2b was rejected.
                                        \nFor more information, contact us (+962) 792924975 or at b2b.hr.department@gmail.com.
                                        \nRegards, b2b development team`,
                                    };
                                    hrTransporter.sendMail(mailOptions, function(error, info){
                                    if (error)
                                        console.log(error);
                                    else
                                        console.log('Email sent: ' + info.response); 
                                    return res.status(200).send({success:true});  
                                    });  
                                    })
                                    .catch(err => {return res.status(500).send({error:"Error deleting the stores. "+err})});
                                })    
                                .catch(err => {return res.status(500).send({error:"Error deleting the warehouse. "+err})});
                            })
                            .catch(err => {return res.status(500).send({error:"Error deleting the menu. "+err})});
                        })
                        .catch(err => {return res.status(500).send({error:"Error getting the stores. "+err})});
                    })
                    .catch(err => {return res.status(500).send({error:"Error deleting the garageOwner. "+err})});
                })
                .catch(err => {return res.status(500).send({error:"Error rejecting the waiting user. "+err})});
            }
        })
        .catch(err => {return res.status(500).send({error:"Error getting user with that id. "+err})});
    }
});
//----------Remove user----------
router.delete('/admin/view-users/delete/:userId', userAuthenticated, (req, res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        return res.status(401).send({error:"Unauthorized user !"});
    else
    {   
        userId = req.params.userId;
        user.exists(req.params.userId)
        .then(getUserResult => {
        if(getUserResult == null)
            return res.status(404).send({error:"Error! Didn't find a user with that id."});
        else
        {
            user.deleteUser(userId)
            .then(deletingUserResult => {
            garageOwner.deleteGarageOwnerByUserId(userId)
                .then(deletingGarageOwnerResult => {
                store.getStoresByUserId(userId)
                    .then(storeIds => {
                    menu.deleteMenuByStoreId(storeIds)
                        .then(deleteMenuResult => {
                        warehouse.deleteWarehouseByStoreId(storeIds)
                            .then(deleteWarehouseResult => {
                            category.getAllCategoriesInUserStores(storeIds)
                                .then(categoryIds => {
                                category.deleteCategoriesByStoreIds(storeIds)
                                    .then(deletedCategories => {
                                    product.deleteProductsOfCategoriesId(categoryIds)
                                        .then(deletedProducts => {
                                        store.deleteStoreByUserId(userId)
                                            .then(deletingStoresResult => {
                                            var mailOptions = {
                                                from: 'b2b.hr.department@gmail.com',
                                                to: deletingUserResult.email,
                                                subject: `Account deletion`,
                                                text: `Hello ${deletingUserResult.fullName},we are sad to inform you that we have decided to delete your account as a garageOwner due to violation on b2b policies.
                                                \nFor more information, contact us (+962) 792924975 or at b2b.hr.department@gmail.com.
                                                \nRegards, b2b development team`,
                                            };
                                            hrTransporter.sendMail(mailOptions, function(error, info){
                                            if (error)
                                                console.log(error);
                                            else
                                                console.log('Email sent: ' + info.response); 
                                            return res.status(200).send({success:true});
                                            });  
                                            })
                                            .catch(err => {return res.status(500).send({error:"Error deleting the stores. "+err})});
                                        })
                                        .catch(err => {return res.status(500).send({error:"Error deleting the products of these categories. "+err})});
                                    })
                                    .catch(err => {return res.status(500).send({error:"Error deleting caegoriesof these stores. "+err})});
                                })
                                .catch(err => {return res.status(500).send({error:"Error getting category ids of these stores. "+err})});    
                            })
                            .catch(err => {return res.status(500).send({error:"Error deleting the warehouse. "+err})});
                        })
                        .catch(err => {return res.status(500).send({error:"Error deleting the menu. "+err})});
                    })
                    .catch(err => {return res.status(500).send({error:"Error getting the stores. "+err})});
                })
                .catch(err => {return res.status(500).send({error:"Error deleting the garageOwner. "+err})});
            })
            .catch(err => {return res.status(500).send({error:"Error rejecting the waiting user. "+err})});
        }
    })
    .catch(err => {return res.status(500).send({error:"Error getting user with that id. "+err})});
    }
});
//----------Trusting Garage Owner----------
router.put('/admin/view-users/trust/:userId', userAuthenticated, (req, res) => {
    loggedUser = req.user;

    if (Object.keys(req.body).length === 0)
        return res.status(400).send({ error: "No data was sent!" });
    if (loggedUser.role !== "admin")
        return res.status(401).send({ error: "Unauthorized user !" });
    else {
        userId = req.params.userId;
        user.exists(userId)
        .then(getUserResult => {
            if(getUserResult == null)
                return res.status(404).send({error:"Error! Didn't find a user with that id."});
            else
            {
                garageOwner.getGarageOwnerByUserId(userId)
                .then(garageOwnerResult => {
                    garageOwner.trustGarageOwner(garageOwnerResult._id)
                    .then(trustResult => {
                        garageOwner.getGarageOwnerByUserId(userId)
                        .then(updatedGarageOwnerResult => {
                            return res.status(200).send(updatedGarageOwnerResult);
                        })
                        .catch(err => {return res.status(500).send({error:"Error getting updated garageOwner. "+err})});
                    })
                    .catch(err => {return res.status(500).send({error:"Error trusting the garage owner. "+err})});
                })
                .catch(err => {return res.status(500).send({error:"Error getting garageOwner by user id. "+err})});
            }
        })
        .catch(err => {return res.status(500).send({error:"Error getting user with that id. "+err})});
    }
});
//----------Update User information----------
router.put('/user/manage-user-info', userAuthenticated, (req, res) => {
    loggedUser = req.user;
    const userId = loggedUser._id;
    userInfo = { _id: userId, ...req.body.user };

    if (Object.keys(req.body).length === 0)
        return res.status(400).send({ error: "No data was sent!" });

    user.exists(userId)
    .then(getUserResult => {
    if(getUserResult == null)
        return res.status(404).send({error:"Error! Didn't find a user with that id."})
    else
    {
        const userValidationResult = user.validateUserInfo(userInfo);
    
        if(typeof userValidationResult !== 'undefined')
            return res.status(400).send({error:userValidationResult.error});
        else
        {
            hashedPassword = hashPassword(userInfo.password);
            userInfo = {...userInfo,password:hashedPassword};

            user.updateUser(userInfo)
            .then(userResult => {
                user.getUserById(userResult._id)
                .then(updatedResult => {
                    return res.status(200).send(updatedResult);
                })
                .catch(err => {return res.status(500).send({error:"Error with getting the updated User. "+err})});
            })
            .catch(err => {return res.status(500).send({error:"Error with updating User. "+err})});
        }
    }
    })
    .catch(err => {return res.status(500).send({error:"Error with getting User. "+err})});
});

router.get('/user-info/:id', userAuthenticated, (req, res) => {
    const userId = req.params.id;
    user.getUser(userId)
        .then(result => {
            return res.status(200).send({
                user: {
                    name: result.fullName,
                    id: result._id
                }
            });
        })
        .catch(err => res.status(500).send({ error: "Error getting the users of that role. " + err }));
});


module.exports = router;