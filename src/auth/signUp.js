const upload = require('../shared/imageUpload');
const bcrypt = require('bcrypt')

/*
const UserModel = require('../models/model/User');
const GarageOwnerModel = require('../models/model/GarageOwner');
const StoreModel = require('../models/model/Store');
const WarehouseModel = require('../models/model/Warehouse');
const MenuModel = require('../models/model/Menu');
const CarOwnerModel = require('../models/model/CarOwner');
const CarModel = require('../models/model/Car');
const ShoppingCartModel = require('../models/model/ShoppingCart');
const Menu = require('../models/model/Menu');
*/

const User = require('../business/User/User');
const Menu = require('../business/Menu/Menu');
const Warehouse = require('../business/Warehouse/Warehouse');
const Store = require('../business/Store/Store');
const GarageOwner = require('../business/GarageOwner/GarageOwner');
const CarOwner = require('../business/CarOwner/CarOwner');
const Car = require('../business/Car/Car');
const ShoppingCart = require('../business//ShoppingCart/ShoppingCart');

const user = new User();
const menu = new Menu();
const warehouse = new Warehouse();
const store = new Store();
const garageOwner = new GarageOwner();
const carOwner = new CarOwner();
const car = new Car();
const shoppingCart = new ShoppingCart();

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
                //UserModel.createUser(userInfo)
                user.createUser(userInfo)
                        .then(userResult => {
                        //MenuModel.createMenu()
                        menu.createMenu()
                            .then(menuResult =>{
                            //WarehouseModel.createWarehouse()
                            warehouse.createWarehouse()
                                .then(warehouseResult =>{
                                //StoreModel.createStore({...storeInfo,userId:userResult._id,menu:menuResult,warehouse:warehouseResult})
                                store.createStore({...storeInfo,userId:userResult._id,menu:menuResult,warehouse:warehouseResult})
                                    .then(storeResult => {
                                    //GarageOwnerModel.createGarageOwner({user:userResult,stores:[storeResult]})
                                    garageOwner.createGarageOwner({user:userResult,stores:[storeResult]})
                                        .then(garageOwnerResult => {
                                        //WarehouseModel.linkWarehouse({_id:warehouseResult._id,storeId:storeResult._id}).then().catch();
                                        //MenuModel.linkMenu({_id:menuResult._id,storeId:storeResult._id}).then().catch();
                                        warehouse.linkWarehouse({_id:warehouseResult._id,storeId:storeResult._id});
                                        menu.linkMenu({_id:menuResult._id,storeId:storeResult._id});//.then().catch();
                                        res.send("Successfully created GarageOwner (waiting user)");
                                    })
                                        .catch(garageOwnerError => {
                                        //UserModel.deleteUser({_id:userResult._id});
                                        //MenuModel.deleteMenu({_id:menuResult._id});
                                        //WarehouseModel.deleteWarehouse({_id:warehouseResult._id});
                                        //StoreModel.deleteStore({_id:storeResult._id});
                                        user.deleteUser(userResult._id);
                                        menu.deleteMenu(menuResult._id);
                                        warehouse.deleteWarehouse(warehouseResult._id);
                                        store.deleteStore(storeResult._id);
                                        res.send("Error with creating GarageOwner: "+garageOwnerError);
                                        });
                                    })    
                                    .catch(storeError =>{
                                    user.deleteUser(userResult._id);
                                    menu.deleteMenu(menuResult._id);
                                    warehouse.deleteWarehouse(warehouseResult._id);
                                    res.send("Error with creating Store: "+storeError);
                                    });
                                })
                                .catch( warehouseError =>{
                                user.deleteUser(userResult._id);
                                menu.deleteMenu(menuResult._id);
                                res.send("Error with creating Warehouse: "+warehouseError);
                                });
                            })
                            .catch(menuError =>{
                                user.deleteUser(userResult._id);
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
                //UserModel.createUser(userInfo) 
                user.createUser(userInfo) 
                         .then(userResult =>{
                         //CarModel.createCar(carInfo)
                         car.createCar(carInfo)
                            .then(carResult => {
                            //ShoppingCartModel.createShoppingCart({})
                            shoppingCart.createShoppingCart()
                                .then(shoppingCartResult => {
                                //CarOwnerModel.createCarOwner({user:userResult,cars:[carResult],shoppingCart:shoppingCartResult._id}) 
                                carOwner.createCarOwner({user:userResult,cars:[carResult],shoppingCart:shoppingCartResult._id}) 
                                    .then(carOwnerResult => {
                                    res.send("Successfully created CarOwner");
                                    })
                                    .catch(carOwnerError =>{
                                    //UserModel.deleteUser({_id:userResult._id});
                                    //CarModel.deleteCar({_id:carResult._id});
                                    //ShoppingCartModel.deleteShoppingCart({_id:shoppingCartResult._id});
                                    user.deleteUser(userResult._id);
                                    car.deleteCar(carResult._id);
                                    shoppingCart.deleteShoppingCart(shoppingCartResult._id);
                                    res.send("Error with creating CarOwner: "+carOwnerError);
                                    });
                                })
                                .catch(shoppingCartError =>{
                                user.deleteUser(userResult._id);
                                car.deleteCar(carResult._id);
                                res.send("Error with creating ShoppingCart: "+shoppingCartError);
                                });
                            })
                            .catch(carError => {
                            user.deleteUser(userResult._id);    
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