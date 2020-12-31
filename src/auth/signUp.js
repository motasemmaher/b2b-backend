const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const upload = require('../shared/imageUpload');

//Setting-up path for the static files
router.use('./public', express.static('uploads'));
//Setting-up req body parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

//Requiring classes
const Warehouse = require('../business/Warehouse/Warehouse');
const Menu = require('../business/Menu/Menu');
const User = require('../business/User/User');
const GarageOwner = require('../business/GarageOwner/GarageOwner');
const CarOwner = require('../business/CarOwner/CarOwner');
const Store = require('../business/Store/Store');
const Car = require('../business/Car/Car');
const ShoppingCart = require('../business/ShoppingCart/ShoppingCart');
//Objects
const user = new User();
const garageOwner = new GarageOwner();
const carOwner = new CarOwner();
const store = new Store();
const warehouse = new Warehouse();
const menu = new Menu();
const car = new Car();
const shoppingCart = new ShoppingCart();

//----------Hashing password----------
function hashPassword(password)
{
    const hash =  bcrypt.hashSync(password, 10);
    return hash;
}
//----------Creating garage owner----------
router.post('/auth/garage-owner/create',upload.single('image'),(req, res) => {
    userInfo = req.body.user;
    const storeInfo = req.body.store;

    const userValidationResult = user.validateUserInfo(userInfo);
    const storeValidationResult = store.validateStoreInfo(storeInfo);
    
    if(typeof userValidationResult !== 'undefined')
        res.send(userValidationResult.err);
    else if(typeof storeValidationResult !== 'undefined')
        res.send(storeValidationResult.err);
    else
    {
        hashedPassword = hashPassword(userInfo.password);
        userInfo = {...userInfo,password:hashedPassword,role:"waitingUser"};
        
        user.createUser(userInfo)
        .then(userResult => {
        menu.createMenu()
            .then(menuResult =>{
            warehouse.createWarehouse()
                .then(warehouseResult =>{
                store.createStore({...storeInfo,userId:userResult._id,menu:menuResult,warehouse:warehouseResult})//,image:req.file.path
                    .then(storeResult => {
                    garageOwner.createGarageOwner({user:userResult,stores:[storeResult]})
                        .then(garageOwnerResult => {
                        warehouse.linkWarehouse({_id:warehouseResult._id,storeId:storeResult._id});
                        menu.linkMenu({_id:menuResult._id,storeId:storeResult._id});
                        res.send("Successfully created GarageOwner (waiting user)");
                        })
                    .catch(err => {
                    user.deleteUser(userResult._id);
                    menu.deleteMenu(menuResult._id);
                    warehouse.deleteWarehouse(warehouseResult._id);
                    store.deleteStore(storeResult._id);
                    res.send("Error with creating GarageOwner: "+err);
                    });
                })    
                .catch(err =>{
                user.deleteUser(userResult._id);
                menu.deleteMenu(menuResult._id);
                warehouse.deleteWarehouse(warehouseResult._id);
                res.send("Error with creating Store: "+err);
                });
            })
            .catch( err =>{
            user.deleteUser(userResult._id);
            menu.deleteMenu(menuResult._id);
            res.send("Error with creating Warehouse: "+err);
            });
        })
        .catch(err =>{
        user.deleteUser(userResult._id);
        res.send("Error with creating Menu: "+err);
        });
    })
    .catch(err =>{
    res.send("Error with creating User: "+err);
    });
    }
});
//----------Creating car owner----------
router.post('/auth/car-owner/create', (req, res) => {
    
    userInfo = req.body.user;
    const carInfo = req.body.car;

    const userValidationResult = user.validateUserInfo(userInfo);
    const carValidationResult = car.validateCarInfo(carInfo);
    
    if(typeof userValidationResult !== 'undefined')
        res.send(userValidationResult.err);
    else if(typeof carValidationResult !== 'undefined')
        res.send(carValidationResult.err);
    else
    {
        hashedPassword = hashPassword(userInfo.password);
        userInfo = {...userInfo,password:hashedPassword,role:"carOwner"};

        user.createUser(userInfo) 
        .then(userResult =>{
        car.createCar(carInfo)
           .then(carResult => {
           shoppingCart.createShoppingCart()
               .then(shoppingCartResult => {
               carOwner.createCarOwner({user:userResult,cars:[carResult],shoppingCart:shoppingCartResult._id}) 
                   .then(carOwnerResult => {
                   res.send("Successfully created CarOwner");
                   })
                   .catch(err =>{
                   user.deleteUser(userResult._id);
                   car.deleteCar(carResult._id);
                   shoppingCart.deleteShoppingCart(shoppingCartResult._id);
                   res.send("Error with creating CarOwner: "+err);
                   });
               })
               .catch(err =>{
               user.deleteUser(userResult._id);
               car.deleteCar(carResult._id);
               res.send("Error with creating ShoppingCart: "+err);
               });
           })
           .catch(err => {
           user.deleteUser(userResult._id);    
           res.send("Error with creating Car: "+err);
           });
        })
        .catch(err => {
        res.send("Error with creating User: "+err);
        });
    }    
});

module.exports = router;
