const express = require('express');
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');
const limitAndSkipValidation = require('./src/validations/limitAndSkipValidation');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

//Setting-up req body parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

const User = require('../business/User/User');
const user = new User();


const hrTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'b2b.hr.department@gmail.com',
      pass: 'b2bgp2020'
    }
  });

//----------Get waiting users----------
router.get('/admin/waiting-users',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        res.send("Unauthorized user !");
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
                res.send({count:countResult,waitingUsers:waitingUsersResult});
                })
                .catch(err => res.send({error:"Error getting the count of waiting users. "+err}))
            })
            .catch(err => res.send({error:"Error getting the waiting users. "+err}));
        })
        .catch(err => res.send({error:"Error getting the users of that role. "+err}));
    }
});
//----------View users----------
router.get('/admin/view-users',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        res.send("Unauthorized user !");
    else
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
                res.send({count:countResult,garageOwners:garageOwnersResult,carOwners:carOwnersResult});
                })
                .catch();
                
                })
                .catch(err => res.send({error:"Error getting the carOwners. "+err}));
            })  
            .catch(err => res.send({error:"Error getting the garageOwners. "+err}));
        })
        .catch(err => res.send({error:"Error getting the users of that role. "+err}));
    }
});
//----------Accepting waiting user----------
router.put('/admin/waiting-users/accept/:userId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        res.send("Unauthorized user !");
    else
    {
        userId = req.params.userId;
        user.exists(userId)
        .then(getUserResult => {
            if(getUserResult == null)
                res.send({error:"Error! Didn't find a user with that id."});
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
                {
                    console.log(error);
                    res.redirect('/admin/waiting-users');
                }
                else
                {
                    console.log('Email sent: ' + info.response); 
                    res.redirect('/admin/waiting-users');
                }    
                });  
                })
                .catch(err => res.send({error:"Error accepting the waiting user. "+err}));
            }
        })
        .catch(err => res.send({error:"Error getting user with that id. "+err}));
    }
});
//----------Rejecting waiting user----------
router.delete('/admin/waiting-users/reject/:userId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        res.send("Unauthorized user !");
    else
    {
        userId = req.params.userId;
        user.exists(userId)
        .then(getUserResult => {
            if(getUserResult == null)
                res.send({error:"Error! Didn't find a user with that id."});
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
                                    {
                                        console.log(error);
                                        res.redirect('/admin/waiting-users');
                                    }
                                    else
                                    {
                                        console.log('Email sent: ' + info.response); 
                                        res.redirect('/admin/waiting-users');
                                    }    
                                    });  
                                    })
                                    .catch(err => res.send({error:"Error deleting the stores. "+err}));
                                })    
                                .catch(err => res.send({error:"Error deleting the warehouse. "+err}));
                            })
                            .catch(err => res.send({error:"Error deleting the menu. "+err}));
                        })
                        .catch(err => res.send({error:"Error getting the stores. "+err}));
                    })
                    .catch(err => res.send({error:"Error deleting the garageOwner. "+err}));
                })
                .catch(err => res.send({error:"Error rejecting the waiting user. "+err}));
            }
        })
        .catch(err => res.send({error:"Error getting user with that id. "+err}));
    }
});
//----------Remove user----------
router.delete('/admin/view-users/delete/:userId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        res.send("Unauthorized user !");
    else
    {   
        userId = req.params.userId;
        user.exists(req.params.userId)
        .then(getUserResult => {
        if(getUserResult == null)
            res.send({error:"Error! Didn't find a user with that id."});
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
                                    product.removeProductsOfCategoriesId(categoryIds)
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
                                            {
                                                console.log(error);
                                                res.send('Removed user');
                                            }
                                            else
                                            {
                                                console.log('Email sent: ' + info.response); 
                                                res.send('Removed user');
                                            }    
                                            });  
                                            })
                                            .catch(err => res.send({error:"Error deleting the stores. "+err}));
                                        })
                                        .catch(err => res.send({error:"Error deleting the products of these categories. "+err}));
                                    })
                                    .catch(err => res.send({error:"Error deleting caegoriesof these stores. "+err}));
                                })
                                .catch(err => res.send({error:"Error getting category ids of these stores. "+err}));    
                            })
                            .catch(err => res.send({error:"Error deleting the warehouse. "+err}));
                        })
                        .catch(err => res.send({error:"Error deleting the menu. "+err}));
                    })
                    .catch(err => res.send({error:"Error getting the stores. "+err}));
                })
                .catch(err => res.send({error:"Error deleting the garageOwner. "+err}));
            })
            .catch(err => res.send({error:"Error rejecting the waiting user. "+err}));
        }
    })
    .catch(err => res.send({error:"Error getting user with that id. "+err}));
    }
});
//----------Update User information----------
router.put('/user/manage-user-info',userAuthenticated,(req, res) => {
    loggedUser = req.user;
    const userId = loggedUser._id;
    userInfo = {_id:userId,...req.body.user};    
    
    user.exists(userId)
    .then(getUserResult => {
    if(getUserResult == null)
        res.send({error:"Error! Didn't find a user with that is."})
    else
    {
        const userValidationResult = user.validateUserInfo(userInfo);
    
        if(typeof userValidationResult !== 'undefined')
            res.send(userValidationResult.err);
        else
        {
            hashedPassword = hashPassword(userInfo.password);
            userInfo = {...userInfo,password:hashedPassword};

            user.updateUser(userInfo)
            .then(userResult => {
            res.send("Updated user information");
            })
            .catch(err => res.send({error:"Error with updating User. "+err}));
        }
    }
    })
    .catch(err => res.send({error:"Error with getting User. "+err}));
});

module.exports = router;