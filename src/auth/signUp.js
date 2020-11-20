const bcrypt = require('bcrypt')

const UserModel = require('../models/model/User');
const GarageOwnerModel = require('../models/model/GarageOwner');
const StoreModel = require('../models/model/Store');
const WarehouseModel = require('../models/model/Warehouse');
const MenuModel = require('../models/model/Menu');
const CarOwnerModel = require('../models/model/CarOwner');
const CarModel = require('../models/model/Car');
const ShoppingCartModel = require('../models/model/ShoppingCart');

const userInformationValidator = require('../validations/userInformation');
const storeInformationValidator = require('../validations/storeInformation');
const carInformationValidator = require('../validations/carInformation');


function hashPassword(password)
{
    const hash =  bcrypt.hashSync(password, 10);
    return hash;
}

module.exports = 
{   
    createGarageOwner(res,userInfo,storeInfo)
    {
        
        userInfoResult = userInformationValidator.validateUserInfo(userInfo);
        storeInfoResult = storeInformationValidator.validateStoreInfo(storeInfo);

        hashedPassword = hashPassword(userInfo.password);
        userInfo = {...userInfo,password:hashedPassword,role:"waitingUser"};
        
        if(userInfoResult === "pass")
            if(storeInfoResult === "pass")
            {
                UserModel.insert(userInfo)
                        .then(userResult => {
                        MenuModel.createMenu()
                            .then(menuResult =>{
                            WarehouseModel.createWarehouse()
                                .then(warehouseResult =>{
                                StoreModel.insert({...storeInfo,menu:menuResult,warehouse:warehouseResult})
                                    .then(storeResult => {
                                    GarageOwnerModel.insert({user:userResult,stores:[storeResult]})
                                        .then(garageOwnerResult => {
                                        MenuModel.linkMenu({_id:menuResult._id,storeId:storeResult._id}).then().catch();
                                        WarehouseModel.linkWarehouse({_id:warehouseResult._id,storeId:storeResult._id}).then().catch();
                                        res.send("Successfully created GarageOwner (waiting user)");
                                    })
                                        .catch(garageOwnerError => {
                                        UserModel.delete({_id:userResult._id});
                                        MenuModel.deleteMenu({_id:menuResult._id});
                                        WarehouseModel.deleteWarehouse({_id:warehouseResult._id});
                                        StoreModel.delete({_id:storeResult._id});
                                        res.send("Error with creating GarageOwner: "+garageOwnerError);
                                        });
                                    })    
                                    .catch(storeError =>{
                                    UserModel.delete({_id:userResult._id});
                                    MenuModel.deleteMenu({_id:menuResult._id});
                                    WarehouseModel.deleteWarehouse({_id:warehouseResult._id});
                                    res.send("Error with creating Store: "+storeError);
                                    });
                                })
                                .catch( warehouseError =>{
                                UserModel.delete({_id:userResult._id});
                                MenuModel.deleteMenu({_id:menuResult._id});
                                res.send("Error with creating Warehouse: "+warehouseError);
                                });
                            })
                            .catch(menuError =>{
                                UserModel.delete({_id:userResult._id});
                                res.send("Error with creating Menu: "+menuError);
                             });
                        })
                        .catch(userError =>{
                        res.send("Error with creating User: "+userError);
                        });
            }
            else
                res.send("Error: "+storeInfoResult);
        else
            res.send("Error: "+userInfoResult);
    }
    ,
    createCarOwner(res,userInfo,carInfo)
    {
        userInfoResult = userInformationValidator.validateUserInfo(userInfo);
        carInfoResult = carInformationValidator.validateCarInfo(carInfo);
        
        hashedPassword = hashPassword(userInfo.password);
        userInfo = {...userInfo,password:hashedPassword};

        if(userInfoResult === "pass")
            if(carInfoResult === "pass")
            {
                //Create the user      
                UserModel.insert(userInfo) 
                         .then(userResult =>{
                         CarModel.createCar(carInfo)
                            .then(carResult => {
                            ShoppingCartModel.insert({})
                                .then(shoppingCartResult => {
                                CarOwnerModel.insert({user:userResult,cars:[carResult],shoppingCart:shoppingCartResult._id}) 
                                    .then(carOwnerResult => {
                                    res.send("Successfully created CarOwner");
                                    })
                                    .catch(carOwnerError =>{
                                    UserModel.delete({_id:userResult._id});
                                    CarModel.deleteCar({_id:carResult._id})
                                    ShoppingCartModel.delete({_id:shoppingCartResult._id});
                                    res.send("Error with creating CarOwner: "+carOwnerError);
                                    });
                                })
                                .catch(shoppingCartError =>{
                                UserModel.delete({_id:userResult._id});
                                CarModel.deleteCar({_id:carResult._id})
                                res.send("Error with creating ShoppingCart: "+shoppingCartError);
                                });
                            })
                            .catch(carError => {
                            UserModel.delete({_id:userResult._id});
                            res.send("Error with creating Car: "+carError);
                            });
                         })
                         .catch(userError => {
                         res.send("Error with creating User: "+userError);
                         });         
            }
            else
                res.send("Error: "+carInfoResult);
        else
            res.send("Error: "+userInfoResult);
        
    }
}