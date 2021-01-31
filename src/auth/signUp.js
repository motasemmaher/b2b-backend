const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const upload = require('../shared/imageUpload');

//Objects
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
router.post('/auth/garage-owner/create',upload.single('image'),(req, res) => {
 
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});

    userInfo = req.body.user;
    const storeInfo = req.body.store;
    const userValidationResult = user.validateUserInfo(userInfo);
    const storeValidationResult = store.validateStoreInfo(storeInfo);
    
    if(typeof userValidationResult !== 'undefined')
        return res.status(400).send({error:userValidationResult.error});
    else if(typeof storeValidationResult !== 'undefined')
        return res.status(400).send({error:storeValidationResult.error});
    else
    {
        hashedPassword = hashPassword(userInfo.password);
        userInfo = {...userInfo,password:hashedPassword,role:"waitingUser"};
        
        user.checkUsername(userInfo.username)
        .then(usernameCheckResult => {
        if(usernameCheckResult != false)
            return res.status(400).send({error:"Error! The username you entered is already in use by another user."});
        else
        {
            user.checkEmail(userInfo.email)
            .then(emailCheckResult => {
            if(emailCheckResult != false)
                return res.status(400).send({error:"Error! The email you entered is already in use by another user."});
            else
            {
                user.checkPhone(userInfo.phoneNumber)
                .then(phoneNumberCheckResult => {
                if(phoneNumberCheckResult != false)
                    return res.status(400).send({error:"Error! The phone number you entered is already in use by another user."});
                else
                {
                    user.createUser(userInfo)
                    .then(userResult => {
                    menu.createMenu()
                        .then(menuResult =>{
                        warehouse.createWarehouse()
                            .then(warehouseResult =>{
                            store.createStore({...storeInfo,userId:userResult._id,menu:menuResult,warehouse:warehouseResult})//,image:req.file.path
                                .then(storeResult => {
                                    report.createReport({}).then(reportInfo => {
                                        garageOwner.createGarageOwner({user:userResult,stores:[storeResult], reportId: reportInfo._id})
                                        .then(garageOwnerResult => {
                                            contact.createContact({ownerId: userResult._id}).then(createdContact => {
                                                warehouse.linkWarehouse({_id:warehouseResult._id,storeId:storeResult._id});
                                                menu.linkMenu({_id:menuResult._id,storeId:storeResult._id});
                                                return res.status(200).send({created:true,message:"SUCCESSFULLY_CREATED_GARAGEOWNER_(WAITING_USER)"});
                                            }).catch(err => {
                                                user.deleteUser(userResult._id);
                                                menu.deleteMenu(menuResult._id);
                                                warehouse.deleteWarehouse(warehouseResult._id);
                                                store.deleteStore(storeResult._id);
                                                return res.status(500).send({error:"Error with creating GarageOwner: "+err});
                                            });
                                        })
                                        .catch(err => {
                                        user.deleteUser(userResult._id);
                                        menu.deleteMenu(menuResult._id);
                                        warehouse.deleteWarehouse(warehouseResult._id);
                                        store.deleteStore(storeResult._id);
                                        return res.status(500).send({error:"Error with creating GarageOwner: "+err});
                                        });
                                    }).catch(err => {
                                        user.deleteUser(userResult._id);
                                        menu.deleteMenu(menuResult._id);
                                        warehouse.deleteWarehouse(warehouseResult._id);
                                        return res.status(500).send({error:"Error with creating report: "+err});
                                    });                                
                                })    
                                .catch(err =>{
                                user.deleteUser(userResult._id);
                                menu.deleteMenu(menuResult._id);
                                warehouse.deleteWarehouse(warehouseResult._id);
                                return res.status(500).send({error:"Error with creating Store: "+err});
                                });
                            })
                            .catch( err =>{
                            user.deleteUser(userResult._id);
                            menu.deleteMenu(menuResult._id);
                            return res.status(500).send({error:"Error with creating Warehouse: "+err});
                            });
                        })
                        .catch(err =>{
                        user.deleteUser(userResult._id);
                        return res.status(500).send({error:"Error with creating Menu: "+err});
                        });
                    })
                    .catch(err =>{return res.status(500).send({error:"Error with creating User: "+err});});
                }
                })
                .catch(err => {return res.status(500).send({error:"Error with checking phoneNumber. "+err})});
            }
            })
            .catch(err => {return res.status(500).send({error:"Error with checking email. "+err})});
        }
        })
        .catch(err => {return res.status(500).send({error:"Error with checking username. "+err})});
    }
});
//----------Creating car owner----------
router.post('/auth/car-owner/create', (req,res) => {
    
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});

    userInfo = req.body.user;
    const carInfo = req.body.car;
    const userValidationResult = user.validateUserInfo(userInfo);
    const carValidationResult = car.validateCarInfo(carInfo);
    
    if(typeof userValidationResult !== 'undefined')
        return res.status(400).send({error:userValidationResult.error});
    else if(typeof carValidationResult !== 'undefined')
        return res.status(400).send({error:carValidationResult.error});
    else
    {
        hashedPassword = hashPassword(userInfo.password);
        userInfo = {
            ...userInfo,
            password: hashedPassword,
            role: "carOwner"
        };

        user.checkUsername(userInfo.username)
        .then(usernameCheckResult => {
        if(usernameCheckResult != false)
            return res.status(400).send({error:"Error! The username you entered is already in use by another user."});
        else
        {
            user.checkEmail(userInfo.email)
            .then(emailCheckResult => {
            if(emailCheckResult != false)
                return res.status(400).send({error:"Error! The email you entered is already in use by another user."});
            else
            {
                user.checkPhone(userInfo.phoneNumber)
                .then(phoneNumberCheckResult => {
                if(phoneNumberCheckResult != false)
                    return res.status(400).send({error:"Error! The phone number you entered is already in use by another user."});
                else
                {
                    user.createUser(userInfo) 
                    .then(userResult =>{
                    car.createCar(carInfo)
                        .then(carResult => {
                        shoppingCart.createShoppingCart()
                            .then(shoppingCartResult => {
                            carOwner.createCarOwner({user:userResult,cars:[carResult],shoppingCart:shoppingCartResult._id}) 
                                .then(carOwnerResult => {
                                    contact.createContact({ownerId: userResult._id}).then(createdContact => {
                                        return res.status(200).send({created:true,message:"SUCCESSFULLY_CREATED_CAROWNER"});
                                    }).catch(err => {
                                        user.deleteUser(userResult._id);
                                        car.deleteCar(carResult._id);
                                        shoppingCart.deleteShoppingCart(shoppingCartResult._id);
                                        return res.status(500).send({error:"Error with creating CarOwner: "+err});
                                    });
                                })
                                .catch(err =>{
                                user.deleteUser(userResult._id);
                                car.deleteCar(carResult._id);
                                shoppingCart.deleteShoppingCart(shoppingCartResult._id);
                                return res.status(500).send({error:"Error with creating CarOwner: "+err});
                                });
                            })
                            .catch(err =>{
                            user.deleteUser(userResult._id);
                            car.deleteCar(carResult._id);
                            return res.status(500).send({error:"Error with creating ShoppingCart: "+err});
                            });
                        })
                        .catch(err => {
                        user.deleteUser(userResult._id);    
                        return res.status(500).send({error:"Error with creating Car: "+err});
                        });
                    })
                    .catch(err => {return res.status(500).send({error:"Error with creating User: "+err})});
                }
                })
                .catch(err => {return res.status(500).send({error:"Error with checking phoneNumber. "+err})});
            }
            })
            .catch(err => {return res.status(500).send({error:"Error with checking email. "+err})});
        }
        })
        .catch(err => {return res.status(500).send({error:"Error with checking username. "+err})});
    }    
});

module.exports = router;