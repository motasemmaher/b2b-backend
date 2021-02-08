//Requiring the necessay files, middlewares and packages
const express = require('express');
const router = express.Router();
const { userAuthenticated } = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
//Requiring the necessay objects
const user = require('../business/Objects').USER;
const garageOwner = require('../business/Objects').GARAGEOWNER;
const carOwner = require('../business/Objects').CAROWNER;
const store = require('../business/Objects').STORE;
const category = require('../business/Objects').CATEGORY;
const product = require('../business/Objects').PRODUCT;
const menu = require('../business/Objects').MENU;
const warehouse = require('../business/Objects').WAREHOUSE;

//Information of the mailer
const hrTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'b2b.hr.department@gmail.com',
        pass: 'b2bgp2020'
    }
});

//----------Hashing password----------
function hashPassword(password) {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
}

//----------Get waiting users----------
router.get('/admin/waiting-users', userAuthenticated, (req, res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response    
    loggedUser = req.user;
    if (loggedUser.role !== "admin")
        return res.status(401).send({ error: "Unauthorized user !" });
    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //Getting the waitingUsers ids
    user.getAllUsersIdOfARole('waitingUser')
        .then(ids => {
            //Getting the information waitingUsers
            garageOwner.getWaitingUsers(ids, limit, skip)
                .then(waitingUsersResult => {
                    //Getting the count of the user of the selected role
                    user.countByRole('waitingUser')
                        .then(countResult => {
                            //Returning a successful response
                            return res.status(200).send({ count: countResult, waitingUsers: waitingUsersResult });
                        })
                        //If getting the count runs into error, then return an error response
                        .catch(err => { return res.status(500).send({ error: "Error getting the count of waiting users. " + err }) })
                })
                //If getting the waiting users runs into error, then return an error response
                .catch(err => { return res.status(500).send({ error: "Error getting the waiting users. " + err }) });
        })
        //If getting the users of the selected role runs into error, then return an error response
        .catch(err => { return res.status(500).send({ error: "Error getting the users of that role. " + err }) });
});
//----------View users----------
router.get('/admin/view-users/:userId?', userAuthenticated, (req, res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response    
    loggedUser = req.user;
    if (loggedUser.role !== "admin")
        return res.status(401).send({ error: "Unauthorized user !" });
    //If the userId wasn't passed in the url, then get all users
    if (req.params.userId == null) {
        //Checking the values of limit and skip
        let skip = req.query.skip;
        let limit = req.query.limit;
        const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
        skip = limitAndSkipValues.skip;
        limit = limitAndSkipValues.limit;
        //Geting all garageOwners user ids
        user.getAllUsersIdOfARole('garageOwner')
            .then(ids => {
                //Getting the information of the garageOwners
                garageOwner.getAllGarageOwners(ids, limit, skip)
                    .then(garageOwnersResult => {
                        //Getting the information of the carOwners
                        carOwner.getAllCarOwners(limit, skip)
                            .then(carOwnersResult => {
                                //Getting the count of all users
                                user.countAll()
                                    .then(countResult => {
                                        //Returning a successful response
                                        return res.status(200).send({ count: countResult, garageOwners: garageOwnersResult, carOwners: carOwnersResult });
                                    })
                                    //If getting the count runs into error, then return an error response
                                    .catch(err => { return res.status(500).send({ error: "Error getting the count of users. " + err }) });
                            })
                            //If getting the carOwners runs into error, then return an error response
                            .catch(err => { return res.status(500).send({ error: "Error getting the carOwners. " + err }) });
                    })
                    //If getting the garageOwners runs into error, then return an error response
                    .catch(err => { return res.status(500).send({ error: "Error getting the garageOwners. " + err }) });
            })
            //If getting the users of a role runs into error, then return an error response
            .catch(err => { return res.status(500).send({ error: "Error getting the users of that role. " + err }) });
    }
    //If the userId was provided, then get the user with that id
    else {
        //Checking if the user exists
        user.exists(req.params.userId)
            .then(existResult => {
                //If the user doesn't exists, then return  an error response
                if (!existResult)
                    return res.status(404).send({ error: "Error! Didn't find a user with that id." });
                else {
                    //Testing if the userId belongs to a garageOwner
                    garageOwner.getGarageOwnerByUserId(req.params.userId).populate("stores")
                        .then(garageOwnerResult => {
                            //If it exists, then proceed
                            if (garageOwnerResult != null) {
                                //Getting the information of the user
                                user.getUserById(req.params.userId)
                                    .then(getUserResult => {
                                        //Returning a successful response
                                        return res.status(200).send({ user: getUserResult, garageOwnerInfo: garageOwnerResult })
                                    })
                                    //If getting the user runs into error, then return an error response
                                    .catch(err => { return res.status(500).send({ error: "Error with getting user with that user id." + err }) });
                            }
                            //If the user doesn't exist as a garageOwner, test if the userId belongs to a garageOwner
                            else {
                                //Testing if the userId belongs to a garageOwner
                                carOwner.getCarOwnerByUserId(req.params.userId).populate("cars")
                                    .then(carOwnerResult => {
                                        //If it exists, then proceed
                                        if (carOwnerResult != null) {
                                            //Getting the information of the user
                                            user.getUserById(req.params.userId)
                                                .then(getUserResult => {
                                                    //Returning a successful response
                                                    return res.status(200).send({ user: getUserResult, carOwnerInfo: carOwnerResult })
                                                })
                                                //If getting the user runs into error, then return an error response
                                                .catch(err => { return res.status(500).send({ error: "Error with getting user with that user id." + err }) });
                                        }
                                        //If the userId belongs to neither a garageOwner nor a carOwner, then return an error response
                                        else
                                            return res.status(404).send({ error: "Error ! Didn't find a garageOwner or a carOwner with that user id." });
                                    })
                                    //If getting the carOwner runs into error, then return an error response
                                    .catch(err => { return res.status(500).send({ error: "Error with getting carOwner with that user id." + err }) });
                            }
                        })
                        //If getting the garageOwner runs into error, then return an error response
                        .catch(err => { return res.status(500).send({ error: "Error with getting garageOwner with that user id." + err }) });
                }
            })
            //If checking if the user exists runs into error, then return an error response
            .catch(err => { return res.status(500).send({ error: "Error with checking if the user exists. " + err }) });
    }
});
//----------Accepting waiting user----------
router.put('/admin/waiting-users/accept/:userId', userAuthenticated, (req, res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response    
    loggedUser = req.user;
    if (loggedUser.role !== "admin")
        return res.status(401).send({ error: "Unauthorized user !" });

    //Checking if the user exist
    userId = req.params.userId;
    user.exists(userId)
        .then(getUserResult => {
            //If the user doesn't exists, then return  an error response
            if (!getUserResult)
                return res.status(404).send({ error: "Error! Didn't find a user with that id." });
            else {
                //Accepting user
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
                        //Sending mail to the user
                        hrTransporter.sendMail(mailOptions, function (error, info) {
                            if (error)
                                console.log(error);
                            else
                                console.log('Email sent: ' + info.response);
                            //Getting the information of the accepted user
                            user.getUserById(acceptanceResult._id)
                                .then(acceptedUserResult => {
                                    //Returning a succssful response
                                    return res.status(200).send(acceptedUserResult);
                                })
                                //If getting the accepted uer runs into error, then return an error response
                                .catch(err => { return res.status(500).send({ error: "Error with getting the acceptedUser . " + err }) });
                        });
                    })
                    //If accepting the waiting user runs into error, then return an error response
                    .catch(err => { return res.status(500).send({ error: "Error accepting the waiting user. " + err }) });
            }
        })
        //If getting the user runs into error, then return an error response
        .catch(err => { return res.status(500).send({ error: "Error getting user with that id. " + err }) });
});
//----------Rejecting waiting user----------
router.delete('/admin/waiting-users/reject/:userId', userAuthenticated, (req, res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response    
    loggedUser = req.user;
    if (loggedUser.role !== "admin")
        return res.status(401).send({ error: "Unauthorized user !" });
    //Checking if the user exists
    userId = req.params.userId;
    user.exists(userId)
        .then(getUserResult => {
            //If the user doesn't exists, then return  an error response
            if (!getUserResult)
                return res.status(404).send({ error: "Error! Didn't find a user with that id." });

            //Deleting user
            user.deleteUser(userId)
                .then(deletingUserResult => {
                    //Deleting garageOwner
                    garageOwner.deleteGarageOwnerByUserId(userId)
                        .then(deletingGarageOwnerResult => {
                            //Getting stores of the user
                            store.getStoresByUserId(userId)
                                .then(storeIds => {
                                    //Deleting menu
                                    menu.deleteMenuByStoreId(storeIds)
                                        .then(deleteMenuResult => {
                                            //Deleting warehouse
                                            warehouse.deleteWarehouseByStoreId(storeIds)
                                                .then(deleteWarehouseResult => {
                                                    //Deleting store
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
                                                            //Sending mail to the user
                                                            hrTransporter.sendMail(mailOptions, function (error, info) {
                                                                if (error)
                                                                    console.log(error);
                                                                else
                                                                    console.log('Email sent: ' + info.response);
                                                                //Returning a successful response
                                                                return res.status(200).send({ success: true });
                                                            });
                                                        })
                                                        //If deleting the store runs into error, then return an error response
                                                        .catch(err => { return res.status(500).send({ error: "Error deleting the stores. " + err }) });
                                                })
                                                //If deleting the warehouse runs into error, then return an error response
                                                .catch(err => { return res.status(500).send({ error: "Error deleting the warehouse. " + err }) });
                                        })
                                        //If deleting the menu runs into error, then return an error response
                                        .catch(err => { return res.status(500).send({ error: "Error deleting the menu. " + err }) });
                                })
                                //If getting the stores runs into error, then return an error response
                                .catch(err => { return res.status(500).send({ error: "Error getting the stores. " + err }) });
                        })
                        //If deleting the garageowner runs into error, then return an error response
                        .catch(err => { return res.status(500).send({ error: "Error deleting the garageOwner. " + err }) });
                })
                //If rejecting the waiting use runs into error, then return an error response
                .catch(err => { return res.status(500).send({ error: "Error rejecting the waiting user. " + err }) });

        })
        //If getting the user runs into error, then return an error response
        .catch(err => { return res.status(500).send({ error: "Error getting user with that id. " + err }) });
});
//----------Remove user----------
router.delete('/admin/view-users/delete/:userId', userAuthenticated, (req, res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response    
    loggedUser = req.user;
    if (loggedUser.role !== "admin")
        return res.status(401).send({ error: "Unauthorized user !" });
    //Checking if the user exists
    userId = req.params.userId;
    user.exists(req.params.userId)
        .then(getUserResult => {
            //If the user doesn't exists, then return  an error response
            if (!getUserResult)
                return res.status(404).send({ error: "Error! Didn't find a user with that id." });
            //Deleting user
            user.deleteUser(userId)
                .then(deletingUserResult => {
                    //Deleting garageOwner
                    garageOwner.deleteGarageOwnerByUserId(userId)
                        .then(deletingGarageOwnerResult => {
                            store.getStoresByUserId(userId)
                                .then(storeIds => {
                                    //Deleting menus of the deleted stores
                                    menu.deleteMenuByStoreId(storeIds)
                                        .then(deleteMenuResult => {
                                            //Deleting warehouses of the deleted stores
                                            warehouse.deleteWarehouseByStoreId(storeIds)
                                                .then(deleteWarehouseResult => {
                                                    //Geting categories of the deleted menus
                                                    category.getAllCategoriesInUserStores(storeIds)
                                                        .then(categoryIds => {
                                                            //Deleting categories of the deleted menus
                                                            category.deleteCategoriesByStoreIds(storeIds)
                                                                .then(deletedCategories => {
                                                                    //Deleting products of the deleted categories
                                                                    product.deleteProductsOfCategoriesId(categoryIds)
                                                                        .then(deletedProducts => {
                                                                            //Deleting stores that belongs to the user
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
                                                                                    //Sending mail
                                                                                    hrTransporter.sendMail(mailOptions, function (error, info) {
                                                                                        if (error)
                                                                                            console.log(error);
                                                                                        else
                                                                                            console.log('Email sent: ' + info.response);
                                                                                        //Returning a successful response
                                                                                        return res.status(200).send({ success: true });
                                                                                    });
                                                                                })
                                                                                //If deleting the stores runs into error, then return an error response
                                                                                .catch(err => { return res.status(500).send({ error: "Error deleting the stores. " + err }) });
                                                                        })
                                                                        //If deleting the products runs into error, then return an error response
                                                                        .catch(err => { return res.status(500).send({ error: "Error deleting the products of these categories. " + err }) });
                                                                })
                                                                //If deleting the categories runs into error, then return an error response
                                                                .catch(err => { return res.status(500).send({ error: "Error deleting categories of these stores. " + err }) });
                                                        })
                                                        //If getting the categories runs into error, then return an error response
                                                        .catch(err => { return res.status(500).send({ error: "Error getting category ids of these stores. " + err }) });
                                                })
                                                //If deleting the warehoues runs into error, then return an error response
                                                .catch(err => { return res.status(500).send({ error: "Error deleting the warehouse. " + err }) });
                                        })
                                        //If deleting the menus runs into error, then return an error response
                                        .catch(err => { return res.status(500).send({ error: "Error deleting the menu. " + err }) });
                                })
                                //If getting the stores runs into error, then return an error response
                                .catch(err => { return res.status(500).send({ error: "Error getting the stores. " + err }) });
                        })
                        //If deleting the garageowner runs into error, then return an error response
                        .catch(err => { return res.status(500).send({ error: "Error deleting the garageOwner. " + err }) });
                })
                //If deleting the user runs into error, then return an error response
                .catch(err => { return res.status(500).send({ error: "Error deleting the user. " + err }) });
        })
        //If getting the user runs into error, then return an error response
        .catch(err => { return res.status(500).send({ error: "Error getting user with that id. " + err }) });
});
//----------Trusting Garage Owner----------
router.put('/admin/view-users/trust/:userId', userAuthenticated, (req, res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response    
    loggedUser = req.user;
    if (loggedUser.role !== "admin")
        return res.status(401).send({ error: "Unauthorized user !" });
    //Checking if the user exists
    userId = req.params.userId;
    user.exists(userId)
        .then(getUserResult => {
            //If the user doesn't exists, then return  an error response
            if (!getUserResult)
                return res.status(404).send({ error: "Error! Didn't find a user with that id." });
            //Getting garageOwner
            garageOwner.getGarageOwnerByUserId(userId)
                .then(garageOwnerResult => {
                    //Trudting the garaeOwner
                    garageOwner.trustGarageOwner(garageOwnerResult._id)
                        .then(trustResult => {
                            //Getting garageOwner
                            garageOwner.getGarageOwnerByUserId(userId)
                                .then(updatedGarageOwnerResult => {
                                    //Returning a successful response
                                    return res.status(200).send(updatedGarageOwnerResult);
                                })
                                //If getting the garageowner runs into error, then return an error response
                                .catch(err => { return res.status(500).send({ error: "Error getting updated garageOwner. " + err }) });
                        })
                        //If trusting the garageowner runs into error, then return an error response
                        .catch(err => { return res.status(500).send({ error: "Error trusting the garage owner. " + err }) });
                })
                //If getting the garageowner runs into error, then return an error response
                .catch(err => { return res.status(500).send({ error: "Error getting garageOwner by user id. " + err }) });
        })
        //If getting the user runs into error, then return an error response
        .catch(err => { return res.status(500).send({ error: "Error getting user with that id. " + err }) });
});
//----------Update User information----------
router.put('/user/manage-user-info', userAuthenticated, (req, res) => {
    //If the user doesn't exists, then return  an error response
    if (Object.keys(req.body).length === 0)
        return res.status(400).send({ error: "No data was sent!" });
    //Storing data
    loggedUser = req.user;
    const userId = loggedUser._id;
    userInfo = { _id: userId, ...req.body.user };
    //Checking if the user exists
    user.exists(userId)
        .then(getUserResult => {
            //If the user doesn't exists, then return  an error response
            if (!getUserResult)
                return res.status(404).send({ error: "Error! Didn't find a user with that id." })
            //Validating the data
            let isPasswordExists = false;
            if(userInfo.password)
            {
                isPasswordExists = true;
            }
            const userValidationResult = user.validateUserInfo(userInfo,isPasswordExists);
            //If error was found, then return an error response
            if (typeof userValidationResult !== 'undefined')
                return res.status(400).send({ error: userValidationResult.error });
            if(isPasswordExists)
            {
                //Hashing password
                hashedPassword = hashPassword(userInfo.password);
                userInfo = { ...userInfo, password: hashedPassword };
            }
            //Updating user information
            user.updateUser(userInfo)
                .then(userResult => {
                    //Getting user
                    user.getUserById(userResult._id)
                        .then(updatedResult => {
                            //Returning a successful response
                            return res.status(200).send(updatedResult);
                        })
                        //If getting the user runs into error, then return an error response
                        .catch(err => { return res.status(500).send({ error: "Error with getting the updated User. " + err }) });
                })
                //If updating the user runs into error, then return an error response
                .catch(err => { return res.status(500).send({ error: "Error with updating User. " + err }) });
        })
        //If getting the user runs into error, then return an error response
        .catch(err => { return res.status(500).send({ error: "Error with getting User. " + err }) });
});

//----------Getting User information----------

router.get('/user-info', userAuthenticated, (req, res) => {
    loggedUser = req.user;
    const userId = loggedUser._id;
    user.getUser(userId)

        .then(result => {
            return res.status(200).send({
                user: {
                    result
                }
            });

        })
        //If getting the user runs into error, then return an error response
        .catch(err => res.status(500).send({ error: "Error getting the user. " + err }));
});
//Exporting the route
module.exports = router;