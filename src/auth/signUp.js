//Requiring the necessary packages and methods
const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const upload = require('../shared/imageUpload');
const uploadImage = require('../shared/uploadImage');

//Requiring the necessary Objects
const user = require('../business/Objects').USER;
const garageOwner = require('../business/Objects').GARAGEOWNER;
const carOwner = require('../business/Objects').CAROWNER;
const store = require('../business/Objects').STORE;
const warehouse = require('../business/Objects').WAREHOUSE;
const menu = require('../business/Objects').MENU;
const car = require('../business/Objects').CAR;
const shoppingCart = require('../business/Objects').SHOPPINGCART;
const contact = require('../business/Objects').CONTACT;
const report = require('../business/Objects').REPORT;
//----------Hashing password----------
function hashPassword(password) {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
}

//----------Creating garage owner----------
router.post('/auth/garage-owner/create',(req, res) => {
    //Chekcing if the request has body or not
    //If it doesn't, return an error response
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});

    //Storing data from the body
    userInfo = req.body.user;
    const storeInfo = req.body.store;
    //Validating data
    const userValidationResult = user.validateUserInfo(userInfo);
    const storeValidationResult = store.validateStoreInfo(storeInfo);
    if(typeof userValidationResult !== 'undefined')
        return res.status(400).send({error:userValidationResult.error});
    else if(typeof storeValidationResult !== 'undefined')
        return res.status(400).send({error:storeValidationResult.error});
    else
    {
        //Hash the entered password
        hashedPassword = hashPassword(userInfo.password);
        //Because this is to create a new garageOwner, at first he needs to go through the validating process. Thus he is saved as a waitingUser
        userInfo = {...userInfo,password:hashedPassword,role:"waitingUser"};
        //Checking if the username is already taken
        user.checkUsername(userInfo.username)
        .then(usernameCheckResult => {
        if(usernameCheckResult)
            return res.status(400).send({error:"Error! The username you entered is already in use by another user."});
        else
        {
            //Checking if the email is already taken
            user.checkEmail(userInfo.email)
            .then(emailCheckResult => {
            if(emailCheckResult)
                return res.status(400).send({error:"Error! The email you entered is already in use by another user."});
            else
            {
                //Checking if the phone is already taken
                user.checkPhone(userInfo.phoneNumber)
                .then(phoneNumberCheckResult => {
                if(phoneNumberCheckResult)
                    return res.status(400).send({error:"Error! The phone number you entered is already in use by another user."});
                else
                {
                    //If the data reaches this point, creating the user begins
                    //Creating user
                    user.createUser(userInfo)
                    .then(userResult => {
                    menu.createMenu()
                        .then(menuResult =>{
                        warehouse.createWarehouse()
                            .then(warehouseResult =>{
                            //Generating random id as an imagename
                            const randomIdValue = randomId.generateId();
                            const path = `public/images/${randomIdValue}.png`;
                            //Creating the store
                            store.createStore({...storeInfo,userId:userResult._id,menu:menuResult,warehouse:warehouseResult,image:path})//,image:req.file.path
                                .then(storeResult => {
                                //Creating report
                                report.createReport({})
                                    .then(reportInfo => {
                                    //Creating the garageOwner and storing the user and store inside him
                                    garageOwner.createGarageOwner({user:userResult,stores:[storeResult]})
                                        .then(garageOwnerResult => {
                                        //Craeting contact
                                        contact.createContact({ownerId: userResult._id})
                                            .then(createdContact => {
                                            //Linking the warehouse and menu to the created store by stooreId
                                            warehouse.linkWarehouse({_id:warehouseResult._id,storeId:storeResult._id});
                                            menu.linkMenu({_id:menuResult._id,storeId:storeResult._id});
                                            //Uploading image to the server
                                            uploadImage.upload(path,req.body.image);
                                            //Returning the successful response
                                            return res.status(200).send({created:true,message:"SUCCESSFULLY_CREATED_GARAGEOWNER_(WAITING_USER)"});
                                            })
                                            //If creating the contact runs into an error, the program will clean-up the created documents and return an error response
                                            .catch(err => {
                                            user.deleteUser(userResult._id);
                                            menu.deleteMenu(menuResult._id);
                                            warehouse.deleteWarehouse(warehouseResult._id);
                                            store.deleteStore(storeResult._id);
                                            return res.status(500).send({error:"Error with creating Contacts: "+err});
                                            });
                                        })
                                        //If creating the garageOwner runs into an error, the program will clean-up the created documents and return an error response
                                        .catch(err => {
                                        user.deleteUser(userResult._id);
                                        menu.deleteMenu(menuResult._id);
                                        warehouse.deleteWarehouse(warehouseResult._id);
                                        store.deleteStore(storeResult._id);
                                        return res.status(500).send({error:"Error with creating GarageOwner: "+err});
                                        });
                                    })
                                    //If creating the report runs into an error, the program will clean-up the created documents and return an error response
                                    .catch(err => {
                                    user.deleteUser(userResult._id);
                                    menu.deleteMenu(menuResult._id);
                                    warehouse.deleteWarehouse(warehouseResult._id);
                                    return res.status(500).send({error:"Error with creating report: "+err});
                                    });                                
                                })    
                                //If creating the store runs into an error, the program will clean-up the created documents and return an error response
                                .catch(err =>{
                                user.deleteUser(userResult._id);
                                menu.deleteMenu(menuResult._id);
                                warehouse.deleteWarehouse(warehouseResult._id);
                                return res.status(500).send({error:"Error with creating Store: "+err});
                                });
                            })
                            //If creating the warehouse runs into an error, the program will clean-up the created documents and return an error response
                            .catch( err =>{
                            user.deleteUser(userResult._id);
                            menu.deleteMenu(menuResult._id);
                            return res.status(500).send({error:"Error with creating Warehouse: "+err});
                            });
                        })
                        //If creating the menu runs into an error, the program will clean-up the created documents and return an error response
                        .catch(err =>{
                        user.deleteUser(userResult._id);
                        return res.status(500).send({error:"Error with creating Menu: "+err});
                        });
                    })
                    //If creating the user runs into an error, the program will return an error response
                    .catch(err =>{return res.status(500).send({error:"Error with creating User: "+err});});
                }
                })
                //If checking phone runs into an error, the program will return an error response
                .catch(err => {return res.status(500).send({error:"Error with checking phoneNumber. "+err})});
            }
            })
            //If checking email runs into an error, the program will return an error response
            .catch(err => {return res.status(500).send({error:"Error with checking email. "+err})});
        }
        })
        //If checking username runs into an error, the program will return an error response
        .catch(err => {return res.status(500).send({error:"Error with checking username. "+err})});
    }
});
//----------Creating car owner----------
router.post('/auth/car-owner/create', (req,res) => {
    //Chekcing if the request has body or not
    //If it doesn't, return an error response
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    //Storing data from the body
    userInfo = req.body.user;
    const carInfo = req.body.car;
    //Validating data
    const userValidationResult = user.validateUserInfo(userInfo);
    const carValidationResult = car.validateCarInfo(carInfo);
    if(typeof userValidationResult !== 'undefined')
        return res.status(400).send({error:userValidationResult.error});
    else if(typeof carValidationResult !== 'undefined')
        return res.status(400).send({error:carValidationResult.error});
    else
    {
        //Hash the entered password
        hashedPassword = hashPassword(userInfo.password);
        //Prepairing data
        userInfo = {
            ...userInfo,
            password: hashedPassword,
            role: "carOwner"
        };
        //Checking if the username is already taken
        user.checkUsername(userInfo.username)
        .then(usernameCheckResult => {
        if(usernameCheckResult)
            return res.status(400).send({error:"Error! The username you entered is already in use by another user."});
        else
        {
            //Checking if the email is already taken
            user.checkEmail(userInfo.email)
            .then(emailCheckResult => {
            if(emailCheckResult)
                return res.status(400).send({error:"Error! The email you entered is already in use by another user."});
            else
            {
                //Checking if the phone is already taken
                user.checkPhone(userInfo.phoneNumber)
                .then(phoneNumberCheckResult => {
                if(phoneNumberCheckResult)
                    return res.status(400).send({error:"Error! The phone number you entered is already in use by another user."});
                else
                {
                    //If the data reaches this point, creating the user begins
                    //Creating user
                    user.createUser(userInfo) 
                    .then(userResult =>{
                    //Creating car
                    car.createCar(carInfo)
                        .then(carResult => {
                        //Creating shoppingCart
                        shoppingCart.createShoppingCart()
                            .then(shoppingCartResult => {
                            //Creating carOwner
                            carOwner.createCarOwner({user:userResult,cars:[carResult],shoppingCart:shoppingCartResult._id}) 
                                .then(carOwnerResult => {
                                    //Creating contact
                                    contact.createContact({ownerId: userResult._id})
                                    .then(createdContact => {
                                        //returning the successful response
                                        return res.status(200).send({created:true,message:"SUCCESSFULLY_CREATED_CAROWNER"});
                                    })
                                    //If creating the contact runs into an error, the program will clean-up the created documents and return an error response
                                    .catch(err => {
                                        user.deleteUser(userResult._id);
                                        car.deleteCar(carResult._id);
                                        shoppingCart.deleteShoppingCart(shoppingCartResult._id);
                                        return res.status(500).send({error:"Error with creating Contact: "+err});
                                    });
                                })
                                //If creating the carOwner runs into an error, the program will clean-up the created documents and return an error response
                                .catch(err =>{
                                user.deleteUser(userResult._id);
                                car.deleteCar(carResult._id);
                                shoppingCart.deleteShoppingCart(shoppingCartResult._id);
                                return res.status(500).send({error:"Error with creating CarOwner: "+err});
                                });
                            })
                            //If creating the shoppingCart runs into an error, the program will clean-up the created documents and return an error response
                            .catch(err =>{
                            user.deleteUser(userResult._id);
                            car.deleteCar(carResult._id);
                            return res.status(500).send({error:"Error with creating ShoppingCart: "+err});
                            });
                        })
                        //If creating the car runs into an error, the program will clean-up the created documents and return an error response
                        .catch(err => {
                        user.deleteUser(userResult._id);    
                        return res.status(500).send({error:"Error with creating Car: "+err});
                        });
                    })
                    //If creating the user runs into an error, the program will return an error response
                    .catch(err => {return res.status(500).send({error:"Error with creating User: "+err})});
                }
                })
                //If checking the phonenumber runs into an error, the program will return an error response
                .catch(err => {return res.status(500).send({error:"Error with checking phoneNumber. "+err})});
            }
            })
            //If checking the email runs into an error, the program will return an error response
            .catch(err => {return res.status(500).send({error:"Error with checking email. "+err})});
        }
        })
        //If checking the username runs into an error, the program will return an error response
        .catch(err => {return res.status(500).send({error:"Error with checking username. "+err})});
    }    
});

//Exporting the route
module.exports = router;