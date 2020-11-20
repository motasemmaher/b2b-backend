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
                UserModel.createUser(userInfo)
                        .then(userResult => {
                        MenuModel.createMenu()
                            .then(menuResult =>{
                            WarehouseModel.createWarehouse()
                                .then(warehouseResult =>{
                                StoreModel.createStore({...storeInfo,menu:menuResult,warehouse:warehouseResult})
                                    .then(storeResult => {
                                    GarageOwnerModel.createGarageOwner({user:userResult,stores:[storeResult]})
                                        .then(garageOwnerResult => {
                                        res.send("Successfully created GarageOwner (waiting user)");
                                    })
                                        .catch(garageOwnerError => {
                                        UserModel.deleteUser({_id:userResult._id});
                                        MenuModel.deleteMenu({_id:menuResult._id});
                                        WarehouseModel.deleteWarehouse({_id:warehouseResult._id});
                                        StoreModel.deleteStore({_id:storeResult._id});
                                        res.send("Error with creating GarageOwner: "+garageOwnerError);
                                        });
                                    })    
                                    .catch(storeError =>{
                                    UserModel.deleteUser({_id:userResult._id});
                                    MenuModel.deleteMenu({_id:menuResult._id});
                                    WarehouseModel.deleteWarehouse({_id:warehouseResult._id});
                                    res.send("Error with creating Store: "+storeError);
                                    });
                                })
                                .catch( warehouseError =>{
                                UserModel.deleteUser({_id:userResult._id});
                                MenuModel.deleteMenu({_id:menuResult._id});
                                res.send("Error with creating Warehouse: "+warehouseError);
                                });
                            })
                            .catch(menuError =>{
                                UserModel.deleteUser({_id:userResult._id});
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
                UserModel.createUser(userInfo) 
                         .then(userResult =>{
                         CarModel.createCar(carInfo)
                            .then(carResult => {
                            ShoppingCartModel.createShoppingCart({})
                                .then(shoppingCartResult => {
                                CarOwnerModel.createCarOwner({user:userResult,cars:[carResult],shoppingCart:shoppingCartResult._id}) 
                                    .then(carOwnerResult => {
                                    res.send("Successfully created CarOwner");
                                    })
                                    .catch(carOwnerError =>{
                                    UserModel.deleteUser({_id:userResult._id});
                                    CarModel.deleteCar({_id:carResult._id})
                                    ShoppingCartModel.deleteShoppingCart({_id:shoppingCartResult._id});
                                    res.send("Error with creating CarOwner: "+carOwnerError);
                                    });
                                })
                                .catch(shoppingCartError =>{
                                UserModel.deleteUser({_id:userResult._id});
                                CarModel.deleteCar({_id:carResult._id})
                                res.send("Error with creating ShoppingCart: "+shoppingCartError);
                                });
                            })
                            .catch(carError => {
                            UserModel.deleteUser({_id:userResult._id});
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