require ('./src/models/model');

//Requiring classes
const Category = require('./src/business/Category/Category');
const Product = require('./src/business/Product/Product');
const Warehouse = require('./src/business/Warehouse/Warehouse');
const Menu = require('./src/business/Menu/Menu');

//Objects
const user = new User();
const garageOwner = new GarageOwner();
const carOwner = new CarOwner();
const store = new Store();
const warehouse = new Warehouse();
const menu = new Menu();
const category = new Category();
const product = new Product();
const complaint = new Complaint();
const message = new Message();
const offer = new Offer();
const car = new Car();
const shoppingCart = new ShoppingCart();

const {userAuthenticated} = require('./src/middleware/authentication');

//Requiring packages
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcrypt');
const upload = require('./src/shared/imageUpload');
const moment = require('moment')
const schedule = require('node-schedule');
const fs = require('fs');
const nodemailer = require('nodemailer');
const imageToBase64 = require('image-to-base64');


//Setting-up path for the static files
app.use('./public', express.static('uploads'));
//Setting-up req body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
//Setting-up CORS options
const corsOptions = {
    origin: 'http://localhost:8100',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200 
}
app.use(cors(corsOptions))


/*-------------------------------------------------Thaer's work start-------------------------------------------------*/

// added By thaer
const ShoppingCart = require('./src/business/ShoppingCart/ShoppingCart');
const Store = require('./src/business/Store/Store');
const CarOwner = require('./src/business/CarOwner/CarOwner');
const User = require('./src/business/User/User');
const CartItem = require('./src/business/CartItem/CartItem');
const Order = require('./src/business/Order/Order');
const GarageOwner = require('./src/business/GarageOwner/GarageOwner');
const Contact = require('./src/business/Contact/Contact');
const Chat = require('./src/business/Chat/Chat');
const Report = require('./src/business/Report/Report');
const Complaint = require('./src/business/Complaint/Complaint');
const Message = require('./src/business/Message/Message');
const Offer = require('./src/business/Offer/Offer');
const Car = require('./src/business/Car/Car');

// validation by thaer
const orderInformationValidator = require('./src/validations/orderInformation');
const cartItemInformationValidator = require('./src/validations/cartItemInformation');
const limitAndSkipValidation = require('./src/validations/limitAndSkipValidation');
const jwt = require('jsonwebtoken');
const SignUp = require('./src/auth/signUp');
const login = require('./src/auth/login');
const {
    userAuthenticated
} = require('./src/middleware/authentication');
const express = require("express");
const bodyParser = require('body-parser');
// const passport = require('passport');
const session = require('express-session');
//Setting-up express app
const app = express();
require('dotenv').config()
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
//Setting-up session and authintication
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

// app.use(passport.initialize());
// app.use(passport.session());


app.post('/user/garage-owner/create', (req, res) => {
    const user = req.body.user;
    const store = req.body.store;

    SignUp.createGarageOwner(res, user, store);
});

app.post('/user/car-owner/create', (req, res) => {
    const user = req.body.user;
    const car = req.body.car;

    SignUp.createCarOwner(res, user, car);
});

app.put('/update-menu/:id', (req, res) => {
    console.log("Inside put")

    Menu.updateMenu({
        _id: req.params.id,
        temp: req.body.temp,
    });
    res.send("Updated Menu");
});


// Login User 
app.get('/user/login', (req, res) => {
    res.json({
        state: 'Hello from login page'
    });
});

app.post('/user/login', (req, res, next) => {
    // console.log(req.body.username, req.body.password);
    const username = req.body.username;
    const password = req.body.password;
    // if(!username)
    if(!req.user) {
        login.login(req, username, password).then(loginInfo => {
            if(loginInfo.blockFor) {
               return res.send(loginInfo);
            }
            if(loginInfo.user !== null) {
                return res.send({user: {
                    _id: loginInfo.user._id,
                    username: loginInfo.user.username,
                    role: loginInfo.user.role
                }});
            } else {
                return res.status(400).send({Error: 'Invalid username or password'});
            }
            
        });
    } else {
        res.send({msg: 'already logged in'});
    }
    


    // passport.authenticate('local', function (err, user, context = {}) {
    // if (err) {
    //     return next(err);
    // }
    // The HTTP 429 Too Many Requests response status code indicates the user has sent too many 
    // requests in a given amount of time ("rate limiting").        
    // A Retry-After header might be included to this 
    //response indicating how long to wait before making a new request.
    // if (context.statusCode === 429) {
    //     res.set('Retry-After', String(context.retrySecs));
    //     return res.status(429).send(context);
    // }
    // if (!user) {
    //     return res.status(400).send({
    //         msg: 'user not found'
    //     });
    // }

    // req.logIn(user, function (err) {
    //     if (err) {
    //         return next(err);
    //     }
    //     return res.json({
    //         user: {
    //             _id: req.user._id,
    //             username: req.user.username,
    //             role: req.user.role
    //         }
    //     });
    // });

    // })(req, res, next);
    // res.json({
    //     state: "User has logged in"
    // });
});

app.delete('/user/logout', (req, res) => {
    req.session.token = null;
    res.redirect('/user/login');
});

// get GarageOwner
// app.get('/getGarageOwner/:id', userAuthenticated, (req, res) => {
//     GarageOwnerModel.getGarageOwner({_id: req.params.id}).populate('user').then((garageOwner) => {
//         res.json(garageOwner);
//     });
// });

// get CarOwner
// app.get('/getCarOwner/:id', userAuthenticated, (req, res) => {
//     CarOwnerModel.getCarOwner({_id: req.params.id}).populate('user').then((CarOwner) => {
//         res.json(CarOwner);
//     });
// });

//log-in & log-out CORS
app.options('/user/login');
app.options('/user/logout');





//Sign-up CORS
app.options('/user/garage-owner/create'); //Creating garageOwner
app.options('/user/car-owner/create'); //Creating carOwner
//----------Hashing password----------
function hashPassword(password)
{
    const hash =  bcrypt.hashSync(password, 10);
    return hash;
}
//----------Creating garage owner----------
app.post('/user/garage-owner/create',upload.single('image'),(req, res) => {
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
app.post('/user/car-owner/create', (req, res) => {
    
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






//User CORS
app.options('/admin/waiting-users'); //View waiting users
app.options('/admin/view-users'); //View user
app.options('/admin/waiting-users/accept/:userId'); //Accepting waiting user
app.options('/admin/waiting-users/reject/:userId'); //Rejecting waiting user
app.options('/admin/view-users/delete/:userId'); //Remove user
app.options('/user/:userId/manage-user-info'); //Update User information
const hrTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'b2b.hr.department@gmail.com',
      pass: 'b2bgp2020'
    }
  });
//----------Get waiting users----------
app.get('/admin/waiting-users',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        res.send("Unauthorized user !");
    else
    {
        let limit = parseInt(req.query.limit);
        let skip = parseInt(req.query.skip);
        if(limit == null || skip == null){
            limit = 30;
            skip = 0;
        }
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
app.get('/admin/view-users',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "admin")
        res.send("Unauthorized user !");
    else
    {
        let limit = parseInt(req.query.limit);
        let skip = parseInt(req.query.skip);
        if(limit == null || skip == null){
            limit = 30;
            skip = 0;
        }
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
app.put('/admin/waiting-users/accept/:userId',userAuthenticated,(req,res) => {
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
app.delete('/admin/waiting-users/reject/:userId',userAuthenticated,(req,res) => {
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
app.delete('/admin/view-users/delete/:userId',userAuthenticated,(req,res) => {
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
app.put('/user/manage-user-info',userAuthenticated,(req, res) => {
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





//Category CORS
app.options('/stores/:storeId/categories/:categoryId?'); //View Categories of a store and View a Category
app.options('/stores/:storeId/create-category'); //Create Category
app.options('/stores/:storeId/update-category/:categoryId'); //Update Category
app.options('/stores/:storeId/delete-category/:categoryId'); //Delete Category
//----------getAllCategoriesIssue---------------
//----------View Categories of a store and View a Category----------
app.get('/stores/:storeId/categories/:categoryId?',(req,res) => {
    storeId = req.params.storeId;
    
    store.exists(storeId)
    .then(storeResult => {
    if(storeResult == null)
        res.send({error:"Error! Didn't find a store with thats id."});
    else
    {
        if(req.params.categoryId == null)
        {
            //Getting the categories list from that menu
            menu.getAllCategories(storeId).populate('categories','name')
            .then(categoriesResult => res.send({count:categoriesResult.categories.length,categories:categoriesResult.categories}))
            .catch(err => res.send({error:"Error getting categories of the requested store. "+err}));
        }
        else
        {
            category.findCategoryById(req.params.categoryId).populate('products')
            .then(categoryResult => {
            if(categoryResult == null)
                res.send({error:"Error! Didn't find a category with that id."});
            else
                res.send(categoryResult)
            })
            .catch(err => res.send({error:"Error getting the requested category. "+err}));
        }
    }
    })
    .catch(err => res.send({error:"Error getting the store. "+err}));
});
//----------Create Category----------
app.post('/stores/:storeId/create-category',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;

    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find a store with that id."})
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            categoryInfo = {...req.body};
            const categoryValidationResult = category.validateCategoryInfo(categoryInfo);
            if(typeof categoryValidationResult !== 'undefined')
                res.send(categoryValidationResult.err);
            else
            {
                //Checking if there is a category with the provided name
                category.findCategoryByName(categoryInfo.name)
                .then(categoryFindResult =>{
                // If there aren't any categories with that name inside the store, begin the creating process
                if (categoryFindResult == null || categoryFindResult.storeId != storeId)
                {
                    //1- Creating category with the provided information
                    category.createCategory({...categoryInfo,storeId:storeId})
                    .then(categoryCreateResult => {
                    //2- Adding a ref for the new category to the store's menu
                    menu.addCategory(storeId,categoryCreateResult)
                        .then(menuResult => {
                        res.send(categoryCreateResult);
                        })
                        .catch(err => {
                        category.removeCategory(categoryCreateResult._id);
                        res.send({error:"Error updating menu.  "+err});
                        });
                    })  
                    .catch(err => res.send({error:"Error creating category.  "+err}));
                }
                // Else it will a return a response that it already exists
                else 
                res.send("A category with that name already exists");
                })
                .catch(err => res.send({error:"Error getting category Name.   "+err}));
            }
        }
        })
        .catch(err => res.send({error:"Error getting store id. "+err}));
    }
});
//----------Update Category----------
app.put('/stores/:storeId/update-category/:categoryId',userAuthenticated,(req,res) => {  
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    categoryInfo = {...req.body};

    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
            console.log(getStoreResult.userId)
            console.log(loggedUser._id)

            if(getStoreResult == null)
            res.send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
        {
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        }
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.send({error:"Error! Didn't find a cateory with that id."})
            else
            {
                const validationResult = category.validateCategoryInfo(categoryInfo);
                if(typeof validationResult !== 'undefined')
                    res.send(validationResult.err);
                else
                {
                    //Checking if there is a category with the name that the user provided in the update information
                    category.findCategoryByName(categoryInfo.name)
                    .then(categoryFindResult =>{
                    // If there aren't any categories with that name inside the store, begin the updating process
                    if (categoryFindResult == null || categoryFindResult.storeId != storeId)
                    { 
                        //1- Update the category with the ID with the new provided information
                        category.updateCategory({_id:categoryId,...categoryInfo})
                        .then(categoryUpdateResult =>{
                        //2- After the update finishes, find the updated category by its ID then return it to the user
                        category.findCategoryById(categoryId)
                            .then(categoryFindResult => {
                            res.send(categoryFindResult);
                            })
                            .catch(err => res.send({error:"Error finding category.  "+err}))
                        })
                        .catch(err => res.send({error:"Error updating category.  "+err}));
                    }
                    // Else it will a return a response that it already exists
                    else    
                        res.send("A category with that name already exists.");
                    })
                    .catch(err => res.send({error:"Error getting category name.    "+err}))
                }
            }
            })
            .catch(err => res.send({error:"Error getting category id.  "+err}));
        }
        })
        .catch(err => res.send({error:"Error getting store id.  "+err}));
    }
});
//----------Delete Category----------
app.delete('/stores/:storeId/delete-category/:categoryId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        storeId = req.params.storeId;
        categoryId = req.params.categoryId;

        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.send({error:"Error! Didn't find a cateory with that id."})
            else
            {
                //Startting the process of deleting the category
                //1- Getting all the categories from the store's menu
                menu.getAllCategories(storeId)
                .then(menuResult => {
                //2- Updating the categories list inside the store's list 
                const index = menuResult.categories.indexOf(categoryId);
                menuResult.categories.splice(index,1);
                menu.updateMenu({storeId:menuResult.storeId,categories:menuResult.categories})
                    .then(updateMenuResult =>{
                    //3- Removing the category    
                    category.removeCategory(categoryId)
                        .then(categoryResult =>{
                        //4- Removing the products inside that category    
                        product.removeProductsOfCategory(categoryId)
                            .then(productsResult =>{
                            //5- Removing the products from the warehouse
                            warehouse.removeProductsFromWarehouse(storeId,categoryId)
                                .then(warehouseResult => {
                                    res.send("Deleted category");
                                })
                                .catch(err => res.send({error:"Error removing products from warehouse.  "+err}));
                            })  
                            .catch(err => res.send({error:"Error removing products of the category.  "+err}))
                        })
                        .catch(err => res.send({error:"Error removing products of the category.  "+err}));
                    })
                    .catch(err => res.send({error:"Error removing category from the menu.  "+err}));
                })
                .catch(err => res.send({error:"Error getting the categories of the menu.  "+err}));
            }
        })
        .catch(err => res.send({error:"Error getting the category id.  "+err}));
        }
        })
        .catch(err => res.send({error:"Error getting the store id.  "+err}));
    }
});





//Product CORS
app.options('/stores/:storeId/products/:productId?'); //View Products of store and View a Product of a Store
app.options('/stores/:storeId/category/:categoryId/products/:productId?'); //View Products of a store and View a Product of a Category
app.options('/stores/:storeId/category/:categoryId/create-product'); //Create Product
app.options('/stores/:storeId/category/:categoryId/update-product/:productId'); //Update Product
app.options('/stores/:storeId/category/:categoryId/delete-product/:productId'); //Delete Product
//----------getAllCategoriesIssue---------------
//----------View products store and View Product----------
app.get('/stores/:storeId/products/:productId?',(req,res) => {
    let nameSort = parseInt(req.query.nameSort);
    let priceSort = parseInt(req.query.priceSort);
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);

    if(limit == null || skip == null)
    {
        limit = 30;
        skip = 0;
    }  
    if (nameSort == null)
        nameSort = 0;
    if (priceSort == null)
        priceSort = 0;
    
    storeId = req.params.storeId;
    store.exists(storeId)
    .then(getStoreResult => {

    if(getStoreResult == null)
        res.send({error:"Error! Didn't find a store with thats id."});
    else
    {
        if(req.params.productId == null)
        {
            product.getProductsOfStore(storeId,limit,skip,nameSort,priceSort)
            .then(productResults => {
            product.countByStore(storeId)
                .then(countResult => {
                res.send({productsCountByStore:countResult,products:productResults});
                })
                .catch((err => res.send({error:"Error getting count of products of the store. "+err})));
            })
            .catch(err => res.send({error:"Error getting products of the store. "+err}));
        }
        else
        {
            product.getProductById(req.params.productId)
                .then(productResult => {    
                if(productResult == null)
                    res.send({error:"Error! Didn't find a product with that id."});
                else
                    res.send(productResult);
                })
                .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
        }
    }
    })
    .catch(err => res.send({error:"Error getting the store. "+err}));
});
//----------View products of a category and View Product----------
app.get('/stores/:storeId/category/:categoryId/products/:productId?',(req,res) => {
    let nameSort = parseInt(req.query.nameSort);
    let priceSort = parseInt(req.query.priceSort);
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);

    if(limit == null || skip == null)
    {
        limit = 30;
        skip = 0;
    }  
    if (nameSort == null)
        nameSort = 0;
    if (priceSort == null)
        priceSort = 0;

    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    productId = req.params.productId;
    
    store.getStoreById(storeId)
    .then(getStoreResult => {
    if(getStoreResult == null)
        res.send({error:"Error! Didn't find a store with thats id."});
    else
    {
        category.findCategoryById(categoryId)
        .then(getCategoryResult => {
        if(getCategoryResult == null)
            res.send({error:"Error! Didn't find a category with that id."});
        else
        {
            if(productId == null)
            {
                //Getting the products of that category
                category.getProductsOfCategory(categoryId,limit,skip,nameSort,priceSort)
                .then(productsResult => res.send(productsResult))
                .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
            }
            else
            {
                product.getProductById(productId)
                .then(productResult => {    
                if(productResult == null)
                    res.send({error:"Error! Didn't find a product with that id."});
                else
                    res.send(productResult);
                })
                .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
            }
        }
        })
        .catch(err => {error:"Error getting caetgory id. "+err});
    }
    })
    .catch(err => res.send({error:"Error getting the store. "+err}));
});
//----------Create Product----------
app.post('/stores/:storeId/category/:categoryId/create-product',userAuthenticated,upload.single('image'),(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    
    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.send({error:"Error! Didn't find a category with that id."})
            else
            {
                //Creating product
                productInfo = {...req.body,storeId:storeId,image:req.file.path,categoryId:categoryId};

                const productValidationResult = product.validateProductInfo(productInfo);
                const warehouseValidationResult = warehouse.validateWarehouseInfo({amount:req.body.amount});
                
                if(typeof productValidationResult !== 'undefined')
                    res.send(productValidationResult.err);
                else if(typeof warehouseValidationResult !== 'undefined')
                    res.send(warehouseValidationResult.err);
                else
                {
                    product.createProduct(productInfo)
                    .then(productResult => {
                    //Adding a ref of the product to the category
                    category.addProduct(categoryId,productResult)
                        .then(categoryResult =>{
                        //Adding the product and its quantity to the warehouse
                        warehouse.addProduct(storeId,productResult._id,categoryId,req.body.amount)
                            .then(warehouseResult => {
                            res.send(productResult);
                            })
                            .catch(err => {
                            res.send({error:"Error updating warehouse. "+err})
                            }); 
                        })
                        .catch(err => {
                        res.send({error:"Error updating category. "+err})
                        });
                    })
                    .catch(err => {
                    res.send({error:"Error creating product. "+err})
                    });
                }            
            }
            }).catch(err => res.send({error:"Error getting category id. "+err}));
        }
        })
        .catch(err => res.send({error:"Error getting store id. "+err}));
    }
});
//----------Update Product----------
app.put('/stores/:storeId/category/:categoryId/update-product/:productId',userAuthenticated,upload.single('image'),(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    productId = req.params.productId;
    
    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.send({error:"Error! Didn't find a category with that id."})
            else
            {
                product.exists(productId)
                .then(getProductResult => {
                if(getProductResult == null)
                    res.send({error:"Error! Didn't find a produt with that id."})
                else
                {
                    productInfo = {...req.body,image:req.file.path};
                    if(req.body.amount === 0)
                        productInfo={...productInfo,isInStock:false};
                    
                    const productValidationResult = product.validateProductInfo(productInfo);
                    const warehouseValidationResult = warehouse.validateWarehouseInfo({amount:req.body.amount});
                    
                    if(typeof productValidationResult !== 'undefined')
                        res.send(productValidationResult.err);
                    else if(typeof warehouseValidationResult !== 'undefined')
                        res.send(warehouseValidationResult.err);
                    else
                    {
                        //Updating product
                        category.findCategoryByName(productInfo.categoryName)
                        .then(categoryFindByNameResult => {       
                        updatedProductInfo = {_id:productId,...productInfo,image:req.file.path,categoryId:categoryFindByNameResult._id}
                        product.updateProduct(updatedProductInfo)
                            .then(productResult =>{
                            if(categoryFindByNameResult._id != categoryId) 
                            {
                                category.removeProductFromCategory(categoryId,productId)
                                .then(removeProductFromCategoryResult => {
                                category.addProduct(updatedProductInfo.categoryId,productResult._id)
                                    .then(addProductTocategoryResult =>{
                                    warehouse.removeProductFromWarehouse(storeId,productId)
                                        .then(removeProductFromWarehouseResult => {
                                        warehouse.addProduct(storeId,productId,updatedProductInfo.categoryId,req.body.amount)
                                            .then(addProductToWarehouseResult =>{
                                            product.getProductById(productId)
                                                .then(productFindResult => {
                                                res.send(productFindResult);
                                                })
                                                .catch(err => res.send({error:"Error finding updated product.  "+err}))
                                            })
                                            .catch(err => {
                                            res.send({error:"Error adding product to warehouse. "+err})
                                            });
                                        })
                                        .catch(err => {
                                        res.send({error:"Error removing product from warehouse. "+err})
                                        });
                                    })
                                    .catch(err => {
                                    res.send({error:"Error adding product to category. "+err})
                                    });
                                })
                                .catch(err => {
                                res.send({error:"Error removing product from category. "+err})
                                }); 
                            } 
                            //wecan get rid of this if/else
                            else
                            {
                                warehouse.removeProductFromWarehouse(storeId,productId)
                                .then(removeProductResultFromWarehouse => {
                                warehouse.addProduct(storeId,productId,categoryId,req.body.amount)
                                    .then(addProductToWarehouseResult =>{
                                    product.getProductById(productId)
                                        .then(productFindResult => {
                                        res.send(productFindResult);
                                        })
                                        .catch(err => res.send({error:"Error finding updated product.  "+err}))
                                    })
                                    .catch(err => {
                                    res.send({error:"Error adding product to warehouse. "+err})
                                    });
                                })
                                .catch(err => {
                                res.send({error:"Error removing product from warehouse. "+err})
                                });
                            }
                            })
                            .catch(err => {
                            res.send({error:"Error updating product. "+err})
                            }); 
                        })
                        .catch(err => res.send({error:"Couldn't find a category with that name. "+err}));
                    }
                }
                })
                .catch(err => res.send({error:"Error getting product by id.    "+err}));
            }
            })
            .catch(err => res.send({error:"Error getting category id. "+err}))
        }
        })
        .catch(err => res.send({error:"Error getting store id. "+err}));    
    }
});
//----------Delete Product----------
app.delete('/stores/:storeId/category/:categoryId/delete-product/:productId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    productId = req.params.productId;
    
    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.send({error:"Error! Didn't find a category with that id."})
            else
            {
                product.exists(productId)
                .then(getProductResult => {
                if(getProductResult == null)
                    res.send({error:"Error! Didn't find a produt with that id."})
                else
                {
                    //Deleting product
                    product.removeProduct(productId)
                    .then(deleteProductResult => {
                    //2- Updating the products list inside the category's list 
                    //Removing product ref from the category
                    category.removeProductFromCategory(categoryId,productId)
                        .then(updateCategoryResult => {
                        //Updating the warehouse
                        warehouse.removeProductFromWarehouse(storeId,productId)
                            .then(warehouseResult => {
                            res.send("Deleted product and updated warehouse and category")
                            })
                            .catch(err => res.send({error:"Error updating warehouse. "+err}));
                        })
                        .catch(err => res.send({error:"Error updating category. "+err}));
                    })
                    .catch(err => res.send({error:"Error deleting product. "+err}));
                }
                })
                .catch(err => res.send({error:"Error getting product by id.    "+err}));
            }
            })
            .catch(err => res.send({error:"Error getting category id. "+err}))
        }
        })
        .catch(err => res.send({error:"Error getting store id. "+err}));    
    }
});
    




//Store CORS
app.options('/stores/:storeId?'); //View Stores and View a Store
app.options('/user/:userId/manage-garage-owner/stores'); //View garageOwner's Stores
app.options('/user/:userId/manage-garage-owner/add-store'); //Add Store
app.options('/user/:userId/manage-garage-owner/update-store/:storeId'); //Update Store
app.options('/user/:userId/manage-garage-owner/delete-store/:storeId'); //Delete Store
//----------View Stores and View a store----------
app.get('/stores/:storeId?',(req,res) => {
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);
    if(limit == null || skip == null){
        limit = 30;
        skip = 0;
    }    

    if(req.params.storeId == null)
    {
        store.getAllStores(limit,skip)
        .then(storesResult => {
        store.countAll()
            .then(countResult => {
            storesArray = storesResult;
            storesArray.forEach((storeResult,index,storesArray) => {
                imageToBase64(storeResult.image)
                .then(base64Image => {
                storeResult.image = base64Image;       
                if(index  === storesArray.length - 1)
                    res.send({count:countResult,stores:storesArray});
                })
                .catch(err => {
                    console.log({error:"Error converting image.    "+err})
                    if (!res.headersSent)
                        res.send({count:countResult,stores:storesArray});
                });  
            }) //End of foreach
            })
            .catch(err => {
                res.send({error:"Error with getting count of all stores.  "+err})
            });
        })
        .catch(err => res.send({error:"Error getting all stores. "+err}));
    }
    else
    {
        store.getStoreById(req.params.storeId)
        .then(storeResult => {
        if(storeResult == null)
            res.send({error:"Error! Didn't find a store with thats id."});
        else
        {
            imageToBase64(storeResult.image)
            .then((base64Image) => {
            storeResult.image = base64Image;
            res.send(storeResult);
            })
            .catch(err => res.send({error:"Error converting image.    "+err}));
        }
        })
        .catch(err => res.send({error:"Error getting the store. "+err}));    
    }
});
//----------View Garage Owner's stores----------
app.get('/user/manage-garage-owner/stores',userAuthenticated,(req, res) => {
    const loggedUser = req.user;
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);
    if(limit == null || skip == null){
        limit = 30;
        skip = 0;
    }

    if(loggedUser.role !== "garageOwner")
        res.send({error:"Unauthorized user !"});
    else
    {
        store.getFullStoresByUserId(loggedUser._id,limit,skip)
        .then(storesResult => {
        store.countByGarageOwner(loggedUser._id)
            .then(countResult => {
            storesArray = storesResult;
            storesArray.forEach((storeResult,index,storesArray) => {
                imageToBase64(storeResult.image)
                .then(base64Image => {
                storeResult.image = base64Image;       
                if(index  === storesArray.length - 1)
                    res.send({count:countResult,stores:storesArray});
                })
                .catch(err =>  {
                    console.log({error:"Error converting image.    "+err});
                    if (!res.headersSent)
                        res.send({count:countResult,stores:storesArray});
                });
            }) //End of foreach
            })
            .catch(err =>res.send({error:"Error with getting count of garage owner's stores.  "+err}));
        })
        .catch(err => res.send({error:"Error with getting stores of the garageowner. "+err}));
    }
});
//----------Add Store----------
app.post('/user/manage-garage-owner/add-store',userAuthenticated,upload.single('image'),(req, res) => {
    const loggedUser = req.user;

    if(loggedUser.role !== "garageOwner")
        res.send({error:"Unauthorized user !"});
    else
    {
        const storeInfo = {...req.body,image:req.file.path,userId:loggedUser._id};
        //console.log(req.body.name)
        const storeValidationResult = store.validateStoreInfo(storeInfo);
    
        if(typeof storeValidationResult !== 'undefined')
            res.send(storeValidationResult.err);
        else
        {
            menu.createMenu()
            .then(menuResult =>{
            warehouse.createWarehouse()
                .then(warehouseResult =>{
                store.createStore({...storeInfo,menu:menuResult,warehouse:warehouseResult})
                    .then(storeResult => {
                    warehouse.linkWarehouse({_id:warehouseResult._id,storeId:storeResult._id});
                    menu.linkMenu({_id:menuResult._id,storeId:storeResult._id});
                    garageOwner.getGarageOwnerByUserId(loggedUser._id)
                    .then(garageOwnerResult => {
                    garageOwner.addStoreToList(garageOwnerResult._id,storeResult)
                        .then(addingResult => {
                            res.redirect(`/user/manage-garage-owner/stores`);
                        })
                        .catch(err => {
                        store.deleteStore(storeResult._id);
                        menu.deleteMenu(menuResult._id);
                        warehouse.deleteWarehouse(warehouseResult._id);
                        res.send({error:"Error adding store to list: "+err});
                        });
                    })
                    .catch(err => {
                    store.deleteStore(storeResult._id);
                    menu.deleteMenu(menuResult._id);
                    warehouse.deleteWarehouse(warehouseResult._id);
                    res.send({error:"Error with getting garageOwner: "+err});
                        });
                    })  
                    .catch(err =>{
                    menu.deleteMenu(menuResult._id);
                    warehouse.deleteWarehouse(warehouseResult._id);
                    res.send({error:"Error with creating Store: "+err});
                    });
                })
                .catch( err =>{
                menu.deleteMenu(menuResult._id);
                res.send({error:"Error with creating Warehouse: "+err});
                });
            })
            .catch(err =>{
            res.send({error:"Error with creating Menu: "+err});
            });
        }
    }
});
//----------Update Store----------
app.put('/user/manage-garage-owner/update-store/:storeId',userAuthenticated,upload.single('image'),(req, res) => {
    const loggedUser = req.user;
    storeId = req.params.storeId;

    if(loggedUser.role !== "garageOwner")
        res.send({error:"Unauthorized user !"});
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {        
            const body = req.body;    
            const storeInfo = {_id:storeId,...body,image:req.file.path};

            const storeValidationResult = store.validateStoreInfo(storeInfo);
            
            if(typeof storeValidationResult !== 'undefined')
                res.send(storeValidationResult.err);
            else
            {
                store.updateStore(storeInfo)
                .then(storeResult => {
                res.redirect(`/user/manage-garage-owner/stores`);
                })
                .catch(storeError => res.send({error:"Error with updating Store: "+storeError}));
            }
        }
        })
        .catch(err => res.send({error:"Error getting store with that id.    "+err}));
    }
});
//----------Delete Store----------
app.delete('/user/manage-garage-owner/delete-store/:storeId',userAuthenticated,(req, res) => {
    const loggedUser = req.user;
    const storeId = req.params.storeId;

    if(loggedUser.role !== "garageOwner")
        res.send({error:"Unauthorized user !"});
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            menu.deleteMenuByStoreId(storeId)
            .then(deleteMenuResult => {
            warehouse.deleteWarehouseByStoreId(storeId)
                .then(deleteWarehouseResult => {
                category.getAllCategoriesInUserStores(storeId)
                    .then(categoryIds => {
                    category.deleteCategoriesByStoreIds(storeId)
                        .then(deletedCategories => {
                        product.removeProductsOfCategoriesId(categoryIds)
                            .then(deletedProducts => {
                            store.deleteStore(storeId)
                                .then(deletingStoresResult => {
                                garageOwner.getGarageOwnerByUserId(loggedUser._id)
                                    .then(garageOwnerResult => {
                                    garageOwner.removeStoreFromList(garageOwnerResult._id,storeId)
                                        .then(removeResult => {
                                        res.redirect(`/user/manage-garage-owner/stores`);
                                        })
                                        .catch(err => res.send({error:"Error removing store from the garageOwner. "+err}));
                                    })
                                    .catch(err => res.send({error:"Error getting garageOwner. "+err}));
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
        }
        })
        .catch(err => res.send({error:"Error getting store with that id.    "+err}));
    }
});





//Car CORS
app.options('/user/:userId/manage-car-owner/cars'); //View carOwner's Cars
app.options('/user/:userId/manage-car-owner/add-car'); //Add Car
app.options('/user/:userId/manage-car-owner/update-car/:carId'); //Update Car
app.options('/user/:userId/manage-car-owner/delete-car/:carId'); //Delete Car
//----------View Car Owner's cars----------
app.get('/user/manage-car-owner/cars/:carId?',userAuthenticated,(req, res) => {
    loggedUser = req.user;

    if(loggedUser.role !== "carOwner")
        res.send({error:"Unauthorized user !"});
    else
    {
        if(req.params.carId == null)
        {
            carOwner.getCarOwnerByUserId(loggedUser._id).populate('cars').exec()
            .then(carOwnerResult => {
            res.send(carOwnerResult.cars);
            })
            .catch(err => res.send({error:"Error with getting car owners. "+err}));
        }
        else
        {
            car.getCar(req.params.carId)
            .then(carResult => {
            res.send(carResult);
            })
            .catch(err => res.send({error:"Error with getting car by id. "+err}));
        }
    }
});
//----------Add Car----------
app.post('/user/manage-car-owner/add-car',userAuthenticated,(req, res) => {

    const loggedUser = req.user;

    if(loggedUser.role !== "carOwner")
        res.send({error:"Unauthorized user !"});
    else
    {
        const carInfo = req.body;
        const carValidationResult = car.validateCarInfo(carInfo);

        if(typeof carValidationResult !== 'undefined')
            res.send(carValidationResult.err);
        else
        {
            car.createCar(carInfo)
            .then(carResult => {
            carOwner.getCarOwnerByUserId(loggedUser._id)
                .then(carOwnerResult => {
                carOwner.addCarToList(carOwnerResult._id,carResult) 
                    .then(addResult => {
                    res.redirect(`/user/manage-car-owner/cars`);
                    })
                    .catch(err =>{
                    car.deleteCar(carResult._id);
                    res.send("Error with adding car to the CarOwner list: "+err);
                    });
                })
                .catch(err => {
                car.deleteCar(carResult._id);
                res.send("Error with getting the CarOwner: "+err);
                });  
            })
            .catch(err => res.send({error:"Error with creating car: "+err}));
        }    
    }
});
//----------Update Car----------
app.put('/user/manage-car-owner/update-car/:carId',userAuthenticated,(req, res) => {
    const loggedUser = req.user;
    const carId = req.params.carId;

    if(loggedUser.role !== "carOwner")
        res.send({error:"Unauthorized user !"});
    else
    {
        car.exists(carId)
        .then(getCarResult => {
        if(getCarResult == null)
            res.send({error:"Error! Didn't find a car with that id."})
        else
        {
            carOwner.getCarOwnerByUserId(loggedUser._id)
            .then(carOwnerResult => {
            if(!carOwnerResult.cars.includes(carId))
                res.send({error:"The requested car doesn't belong to this carowner."});
            else
            {
                carInfo = {_id:carId,...req.body};    
                const carValidationResult = car.validateCarInfo(carInfo);
                if(typeof carValidationResult !== 'undefined')
                    res.send(carValidationResult.err);
                else
                {
                    car.updateCar(carInfo)
                    .then(carResult => {
                    res.redirect(`/user/manage-car-owner/cars`);
                    })
                    .catch(err => res.send({error:"Error with updating Car. "+storeError}));
                }
            }
            })
            .catch(err => res.send({error:"Error with etting the car owner from the user id.    "+err}));
        }
        })
        .catch(err => res.send({error:"Error with getting car with that id. "+err}));
    }
});
//----------Delete Car----------
app.delete('/user/manage-car-owner/delete-car/:carId',userAuthenticated,(req, res) => {
    const loggedUser = req.user;
    const carId = req.params.carId;

    if(loggedUser.role !== "carOwner")
        res.send({error:"Unauthorized user !"});
    else
    {
        car.exists(carId)
        .then(getCarResult => {
        if(getCarResult == null)
            res.send({error:"Error! Didn't find a car with that id."})
        else
        {
            carOwner.getCarOwnerByUserId(loggedUser._id)
            .then(carOwnerResult => {
            if(!carOwnerResult.cars.includes(carId))
                res.send({error:"The requested car doesn't belong to this carowner."});
            else
            {
                car.deleteCar(carId)
                .then(carResult => {
                carOwner.getCarOwnerByUserId(loggedUser._id)
                    .then(carOwnerResult => {
                    carOwner.removeCarFromList(carOwnerResult._id,carId)
                        .then(removeResult => {
                        res.redirect(`/user/manage-car-owner/cars`);
                        })
                        .catch(err => res.send({error:"Error removing car from the carOwner. "+err}));
                    })
                    .catch(err => res.send({error:"Error getting carOwner. "+err}));
                })
                .catch(err => res.send({error:"Error deleting the car. "+err}));    
            }
            })
            .catch(err => res.send({error:"Error with getting the car owner from the user id.   "+err}));
        }
        })
        .catch(err => res.send({error:"Error with getting car with that id. "+err}));
    }
});





//Offer CORS
app.options('/stores/:storeId/offers'); //View offers of a Store
app.options('/stores/:storeId/offers/add-offer'); //Add Offer
app.options('/stores/:storeId/offers/delete-offer/:offerId'); //Delete Offer
//----------Clear Offers----------
const checkOffers = schedule.scheduleJob('0 * * * *', () => {
    console.log("CHECKING OFFERS");
    product.expiredOffers()
    .then(productsResult => {
        productsResult.forEach(record => {
            if(record.offer == null)
                return;
            else
            {
                offer.deleteOffer(record.offer._id)
                .then(offerResult => {
                    product.removeOffer(offerResult._id)
                    .then(productResult => {
                        console.log("Deleted an offer");
                        return;
                    })
                    .catch(err => console.log("Error with removing offer from product. "+err));
                })
                .catch(err => console.log("Error with deleting offer. "+err));
            }
        });
        console.log("Removed all expired offers");
    })
    .catch(err => console.log("Error with getting expired offers. "+err));
});
//----------View products with offers of a store----------
app.get('/stores/:storeId/offers',(req,res) => {
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);
    if(limit == null || skip == null){
        limit = 30;
        skip = 0;
    }

    storeId = req.params.storeId;

    store.exists(storeId)
    .then(getStoreResult => {
    if(getStoreResult == null)
        res.send({error:"Error! Didn't find a store with thats id."});
    else
    {
        product.getProductsWithOffers(storeId,limit,skip)
        .then(offersResult => {
        product.countByOffers(storeId)
            .then(countResult => {
            res.send({count:countResult,offers:offersResult});
            })    
            .catch(err => res.send({error:"Error with getting count of offers.  "+err}));
        })
        .catch(err => res.send({error:"Error with getting offers of the store.  "+err}));
    }
    })
    .catch(err => res.send({error:"Error getting the store. "+err}));
});
//----------add Offer----------
app.post('/stores/:storeId/offers/add-offer',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;

    if(loggedUser.role !== "garageOwner")
        res.send({error:"Unauthorized user"});
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            productOffers = req.body.productOffers;
            productOffers.forEach(productOffer =>{
                newPrice = productOffer['price'] - (productOffer['price']*(productOffer['discountRate']/100));
                const offerValidationResult = offer.validateOfferInfo({discountRate:productOffer['discountRate'],
                                                                       duration:productOffer['duration'],
                                                                       newPrice:newPrice});
                if(typeof offerValidationResult !== 'undefined')
                    res.send(offerValidationResult.err);
                else
                {           
                    offer.createOffer(productOffer['discountRate'],productOffer['duration'],newPrice)
                    .then(offerResult => {
                    product.addOffer(productOffer['productId'],offerResult)
                        .then(productResult => {
                        res.send("Added offer successfuly");
                        })
                        .catch(err => {
                        res.send({error:"Error with adding offer to product. "+err});
                        offer.deleteOffer(offerResult._id);
                        });
                    })
                    .catch(err => res.send({error:"Error with creating offer. "+err}));
                }
            });    
        }
        })
        .catch(err => res.send({error:"Error getting store with that id.    "+err}));
    }
});
//----------delete Offer----------
app.delete('/stores/:storeId/offers/delete-offer/:offerId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    offerId = req.params.offerId;

    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            offer.exists(offerId)
            .then(getOfferResult => {
            if(getOfferResult == null)
                res.send({error:"Error! Didn't find offer with that id."});
            else
            {
                product.removeOffer(offerId)
                .then(productResult => {
                offer.deleteOffer(offerId)
                    .then(offerResult => {
                    res.send("Deleted offer");
                    })
                    .catch(err => res.send({error:"Error with deleting offer. "+err}));
                })
                .catch(err => res.send({error:"Error with removing offer from the product. "+err}));
            }
            })
            .catch(err => res.send({error:"Error with getting offer id. "+err}));
        }
        })
        .catch(err => res.send({error:"Error getting store with that id.    "+err}));
    }
});





//Complaint CORS
app.options('/stores/:storeId/create-complaint/:submitterId'); //Create Complaint
app.options('/view-complaints/:userId'); //View Complaints
//app.options('/view-complaints/complaint/:complaintId'); //View A Complaint
//----------Create Complaint----------
app.post('/stores/:storeId/create-complaint',userAuthenticated,(req,res) => {
    const loggedUser = req.user;
    const storeId = req.params.storeId;

    if(loggedUser.role !== "carOwner")
        res.send({error:"Unauthorized user !"});
    else
    {
        store.exists(storeId)
        .then(storeResult => {
        if(storeResult == null)
            res.send({error:"Error! Didn't find a store with that id."});
        else
        {
            user.exists(loggedUser._id)
            .then(getUserResult => {
                if(getUserResult == null)
                    res.send({error:"Error! Didn't find a user with that is."})
                else
                {
                    messageBody = req.body.message;
                    const messageValidationResult = message.validateMessageInfo({data:messageBody});
                    if(typeof messageValidationResult !== 'undefined')
                        res.send(messageValidationResult.err);
                    else
                    {
                        message.createMessage(loggedUser._id,messageBody)
                        .then(messageResult => {
                        complaint.createComplaint(loggedUser._id,messageResult,storeResult.userId,storeId)
                            .then(complaintResult => {
                            res.send(complaintResult);
                            //res.redirect('/store/'+req.params.id);
                            })
                        .catch(err => res.send({error:"Error creating the complaint. "+err}));
                        })
                        .catch(err => res.send({error:"Error creating the message. "+err}));
                    }
                }
            })
            .catch(err => res.send({error:"Error getting the user. "+err}));    
        }
        })
        .catch(err => res.send({error:"Error getting the store. "+err}));
    }
});
//----------View Complaints and View Complaint----------
app.get('/view-complaints/:complaintId?',userAuthenticated,(req,res) => {
    const loggedUser = req.user;
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);
    if(limit == null || skip == null){
        limit = 30;
        skip = 0;
    }

    if(req.params.complaintId != null)
    {
        complaint.getComplaint(req.params.complaintId)
        .then(complaintResult => {
        if(complaintResult == null)
            res.status(404).send({error:"Error! Didn't find a complaint with that id."});
        else
            res.status(200).send(complaintResult);
        })
        .catch(err => res.status(404).send({error:"Error getting the complaint. "+err}));
    }
    else if(loggedUser.role === 'admin')
    {
        complaint.getAllComplaints(limit,skip)
        .then(complaintResult => {
        complaint.countAllComplaints()
            .then(countResult => {
            res.send({count:countResult,complaints:complaintResult});
            })
            .catch(err => res.send({error:"Error getting the count of all complaints. "+err}));
        })
        .catch(err => res.send({error:"Error getting all complaints. "+err}));
    }
    else if(loggedUser.role === 'garageOwner')
    {
        complaint.getGarageOwnerComplaints(loggedUser._id,limit,skip)
        .then(complaintResult => {
        complaint.countByGarageOwner(loggedUser._id)
        .then(countResult => {
        res.send({count:countResult,complaints:complaintResult});
        })
        .catch(err => res.send({error:"Error getting the count of garageOwner's complaints. "+err}));
        })
        .catch(err => res.send({error:"Error getting the garageOwner's complaints. "+err}));
    }
    else
        res.send({error:"Error, the user isn't allowed to view the complaints."});
});






//--------------------------------------Report--------------------------------------
const reportTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'b2b.report.generator@gmail.com',
    pass: 'b2bgp2020'
  }
});
//----------Send garage owner report----------
/*
const garageOwnerReport = schedule.scheduleJob('0 0 1 * *', () => {
    
        user.getAllUsersIdOfARole('garageOwner')
        .then(garageOwners => {
        garageOwners.forEach(garageOwnerId => {
            user.getUserById(garageOwnerId._id)
                .then(garageOwner => {
                store.getFullStoresByUserId(garageOwner._id)
                .then(storesList => {
                    storesArray = storesList;
                    storesArray.forEach((store,index,storesArray) => {
                    category.getProductsOfCategory(categoryId)
                    .then(productsResult => {
                    allProducts = allProducts.concat(productsResult);
                        if(index  === categoriesArray.length - 1 )
                        res.send(allProducts);
                    })
                    .catch(err => res.send({error:"Error getting products of the category. "+err}));
                    });
                })
                .catch(err => console.log("Error in generating report -Geting stores- ! "+err));
                var mailOptions = {
                    from: 'b2b.report.generator@gmail.com',
                    to: garageOwner.email,
                    subject: `Month:${new Date().getMonth()+1}/${new Date().getFullYear()} Report`,
                    text: `Hello ${garageOwner.fullName},this is the report for the current month.\nBest wishes, B2B team`,
                    attachments : [
                        {
                            filename: `report#${new Date().getMonth()+1}/${new Date().getFullYear()}.txt`,  
                            path: './public/report.txt'
                        }]
                    };
                    reportTransporter.sendMail(mailOptions, function(error, info){
                    if (error)
                        console.log(error);
                    else
                        console.log('Email sent: ' + info.response); 
                    });  
                })
                .catch(err => console.log("Error in generating report -Geeting garage owner by id- ! "+err));    
            })
        })
        .catch(err => console.log("Error in generating report -Geting garage owners- ! "+err));
    });            
});
*/
//----------Send admin report----------
const adminReport = schedule.scheduleJob('0 0 1 * *', () => {
        
    user.getAllUsersIdOfARole('garageOwner')
    .then(garageOwners => {
    user.getAllUsersIdOfARole('carOwner')
        .then(carOwners => {
        user.getAllUsersIdOfARole('waitingUser')
            .then(waitingUsers => {
            report = `#of Garage Owners: ${garageOwners.length}\n#of Car Owners: ${carOwners.length}\n#of Waiting Users: ${waitingUsers.length}\n`;
            user.getAllUsersIdOfARole('admin')
                .then(admins => {
                admins.forEach(adminId => {
                user.getUserById(adminId._id)
                    .then(admin => {
                    fs.writeFile("./public/admin-report.txt",report,(err) => {
                    if(err)
                        return console.log(err);                    
                    });
                    var mailOptions = {
                        from: 'b2b.report.generator@gmail.com',
                        to: admin.email,
                        subject: `Admin,Month:${new Date().getMonth()+1}/${new Date().getFullYear()} Report`,
                        text: `Hello ${admin.fullName},this is the report for the current month.\nBest wishes, B2B team`,
                        attachments : [
                            {
                                filename: `admin-report#${new Date().getMonth()+1}/${new Date().getFullYear()}.txt`,  
                                path: './public/admin-report.txt'
                            }]
                        };
                        reportTransporter.sendMail(mailOptions, function(error, info){
                    if (error)
                        console.log(error);
                    else
                        console.log('Email sent: ' + info.response); 
                        });  
                    })
                    .catch(err => res.send({error:"Error getting the admin by id. "+err}));    
                }); //End of for each
                })
                .catch(err => res.send({error:"Error getting all the admins owners. "+err}));
            })
            .catch(err => res.send({error:"Error getting all the waiting users. "+err}));
        })
        .catch(err => res.send({error:"Error getting all the car owners. "+err}));
    })
    .catch(err => res.send({error:"Error getting all the garage owners. "+err}));
});

//--------------------Chat--------------------\\
let userForChat = new Set();

app.post('/user/contact/create', userAuthenticated, (req, res) => {
    contact = new Contact();
    chat = new Chat();
    let chatBetween = "";
    const garageOwnerId = req.body.garageOwnerId;
    const userInfo = req.user;
    if (userInfo._id > garageOwnerId) {
        chatBetween = userInfo._id + "-" + garageOwnerId
    } else {
        chatBetween = garageOwnerId + "-" + userInfo._id
    }
    contact.updateContact({
        ownerId: userInfo._id,
        name: req.body.storeName,
        otherUserId: garageOwnerId
    }).then(retrivedUserContact => {
        console.log(retrivedUserContact);
        contact.updateContact({
            ownerId: garageOwnerId,
            name: req.body.userName,
            otherUserId: userInfo._id
        }).then(retrivedGarageOwnerContact => {
            console.log(retrivedGarageOwnerContact);
            if (userInfo._id > garageOwnerId) {
                userForChat.add(userInfo._id + "-" + garageOwnerId)
            } else {
                userForChat.add(garageOwnerId + "-" + userInfo._id)
            }
            chat.create({
                contactBetween: chatBetween
            }).then(CreatedChat => {
                res.status(200).send(retrivedGarageOwnerContact);
            }).catch(err => {
                res.status(400).send({
                    err: err
                });
            });
        }).catch(err => {
            res.status(400).send({
                err: err
            });
        });
    }).catch(err => {
        res.status(400).send({
            err: err
        });
    });
});

app.get('/user/contact/get', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    contact = new Contact();
    Contact.getContactByOwnerId(userInfo._id).then(results => {
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
            err: err
        });
    });
});

app.delete('/user/contact', userAuthenticated, (req, res) => {
    contact = new Contact();
    const userInfo = req.user;
    contact.deleteOne(
        userInfo._id
    ).then(results => {
        res.status(201).send(results);
    }).catch(err => {
        console.log(err);
        res.status(400).send({
            err: err
        });
    });
});

app.get('/user/chat/:contactID', userAuthenticated, (req, res) => {
    chat = new Chat();
    let chatBetween = "";
    const userInfo = req.user;
    const contactId = req.params.contactID;
    if (contactId > userInfo._Id) {
        chatBetween = contactId + "-" + userInfo._Id
    } else {
        chatBetween = userInfo._Id + "-" + contactId
    }
    chat.getChat(chatBetween).then(results => {
        res.status(200).send(results);
    }).catch(err => {
        if (err) {
            console.log(err);
            res.status(400).send({
                err: err
            })
        }
    });
});

app.get('/user/chat/hasContactId/:subcontactId', userAuthenticated, (req, res) => {
    contact = new Contact();
    const userInfo = req.user;
    const subcontactId = req.params.subcontactId;
    contact.getContactByOwnerIdAndSubContactId(userInfo._id, subcontactId).then(result => {
        if (result.error) {
            return res.status(200).send({
                has: false
            })
        } else if (result) {
            return res.status(200).send({
                has: true
            })
        }
    }).catch(err => {
        if (err) {
            console.log(err)
            res.status(400).send({
                err: err
            })
        }
    });
});

var chat = io.of('/user/chat/start')
    .on('connection', (socket) => {
        chat = new Chat();
        userForChat.forEach(Element => {
            socket.on(Element, (message) => {
                chat.pushMessage(Element, message).then(result => {
                    socket.broadcast.emit(Element, message);
                }).catch(err => {
                    if (err) {
                        console.log(err)
                        res.status(400).send({
                            err: err
                        })
                    }
                });

            });

        });

    });

//---------get shoppingcart---------------\\
app.get('/shoppingcart', userAuthenticated, (req, res) => {
    shoppingCart = new ShoppingCart();
    cartItem = new CartItem();
    carOwner = new CarOwner();
    console.log(req.msuser);
    if (!req.query.limit && !req.query.skip) {
        return res.status(400).send({
            Error: 'skip and limit must exist'
        });
    }
    const limitAndSkipValidater = limitAndSkipValidation.validateLimitAndSkip(req.query.limit, req.query.skip);
    if (limitAndSkipValidater !== 'pass') {
        return res.status(400).send({
            Error: limitAndSkipValidater
        });
    }

    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    if (skip < 0) {
        return res.status(400).send({
            Error: 'skip must be equal or more than zero'
        });
    }

    if (limit <= 0) {
        return res.status(400).send({
            Error: 'limit must be more than zero'
        });
    }

    const userInfo = req.user;
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId({
            user: userInfo._id
        }).populate('shoppingCart').then(carOwnerInfo => {
            cartItem.getCartItemsAssociatedWithShoppingCartId(carOwnerInfo.shoppingCart._id, limit, skip)
                .then(retrivedCartItems => {
                    res.send({
                        shoppingCart: {
                            shoppingCartId: carOwnerInfo.shoppingCart._id,
                            totalBill: carOwnerInfo.shoppingCart.totalBill
                        },
                        cartItems: retrivedCartItems
                    });
                }).catch(err => {
                    res.status(404).send(err);
                });
        }).catch(err => {
            res.status(404).send(err);
        });
    } else {
        res.status(403).send({
            Error: {
                Error: 'you cannot access this page'
            }
        });
    }
});

//---------get cartItem from shoppingcart (back here)---------------\\
app.get('/shoppingcart/cartItem/:cartItemId', userAuthenticated, (req, res) => {
    shoppingCart = new ShoppingCart();
    cartItem = new CartItem();
    carOwner = new CarOwner();

    const userInfo = req.user;
    const cartItemId = req.params.cartItemId;

    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId({
            user: userInfo._id
        }).populate('shoppingCart').then(carOwnerInfo => {
            cartItem.getCartItemAssociatedWithShoppingCartId(carOwnerInfo.shoppingCart._id, cartItemId)
                .then(retrivedCartItem => {
                    res.send({
                        cartItem: retrivedCartItem
                    });
                }).catch(err => {
                    res.status(404).send(err);
                });
        }).catch(err => {
            res.status(404).send(err);
        });
    } else {
        res.status(403).send({
            Error: {
                Error: 'you cannot access this page'
            }
        });
    }
});

//------------------add cartItem to shoppingcart by car owner-----------------\\
app.post('/shoppingcart/addcart', userAuthenticated, (req, res) => {
    const productId = req.body.productId;
    const date = req.body.date;
    const storeId = req.body.storeId;
    const userInfo = req.user;

    const isValidQuantity = cartItemInformationValidator.validateCartItemInfo({
        quantity: req.body.quantity.toString()
    });

    if (isValidQuantity !== 'pass') {
        return res.status(400).send({
            Error: isValidQuantity
        });
    }

    const quantity = parseInt(req.body.quantity.toString());

    if (quantity <= 0) {
        return res.status(400).send({
            Error: 'Quantity must be more than Zero'
        });
    }

    shoppingCart = new ShoppingCart();
    store = new Store();
    cartItem = new CartItem();
    carOwner = new CarOwner();
    warehouse = new Warehouse();

    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId({
            user: userInfo._id
        }).then(carOwnerInfo => {
            store.getStore(storeId)
                .then(storeInfo => {
                    warehouse.getProductFromWarehouse(
                        storeInfo.warehouse, productId
                    ).populate({
                        path: 'storage.productId'
                    }).then(warehouseInfo => {
                        if (warehouseInfo.storage[0].amount >= quantity) {
                            const totalPrice = warehouseInfo.storage[0].productId.price * quantity;
                            if (totalPrice > 0) {
                                cartItem.createCartItem({
                                    product: productId,
                                    quantity: quantity,
                                    date: date,
                                    storeId: storeId,
                                    shoppingCart: carOwnerInfo.shoppingCart,
                                    totalPrice: totalPrice
                                }).then(item => {
                                    shoppingCart.addCartItem(carOwnerInfo.shoppingCart, item).then((updatedShoppingCart) => {
                                        res.status(200).send(updatedShoppingCart);
                                    });
                                }).catch(err => {
                                    return res.status(401).send(err);
                                });
                            } else {
                                return res.status(401).send('Error With The Price');
                            }
                        } else {
                            return res.status(401).send('Error This Quantity Is not available');
                        }
                    }).catch(err => {
                        return res.status(404).send(err);
                    });
                }).catch(err => {
                    return res.status(404).send(err);
                });
        }).catch(err => {
            return res.status(404).send(err);
        });
    } else {
        return res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

//------------remove cartitem by car owner-----------\\
app.delete('/shoppingcart/removecartitem', userAuthenticated, (req, res) => {
    cartItem = new CartItem();
    shoppingCart = new ShoppingCart();
    const cartItemId = req.body.cartItemId;
    const shoppingCartId = req.body.shoppingCartId;
    shoppingCart.removeCartItem(shoppingCartId, cartItemId).then(updatedShoppingCart => {
        cartItem.deleteCartItem({
            _id: cartItemId
        }).then(deletedCartItem => {
            res.status(200).send(updatedShoppingCart);
        }).catch(err => {
            res.status(501).send(err);
        });
    }).catch(err => {
        res.status(501).send(err);
    });
});

//------------update cartitem by car owner-----------\\
app.put('/shoppingcart/updatecartitem', userAuthenticated, (req, res) => {
    const cartItemId = req.body.cartItemId;

    const isValidQuantity = cartItemInformationValidator.validateCartItemInfo({
        quantity: req.body.quantity.toString()
    });

    if (isValidQuantity !== 'pass') {
        return res.status(400).send({
            Error: isValidQuantity
        });
    }

    const quantity = parseInt(req.body.quantity.toString());


    if (quantity <= 0) {
        return res.status(400).send({
            Error: 'Quantity must be more than Zero'
        });
    }

    shoppingCart = new ShoppingCart();
    store = new Store();
    cartItem = new CartItem();
    warehouse = new Warehouse();

    cartItem.getCartItem(cartItemId).then(retrivedCartItem => {
        store.getStore({
            _id: retrivedCartItem.storeId
        }).then(storeInfo => {
            warehouse.getProductFromWarehouse(
                storeInfo.warehouse, retrivedCartItem.product
            ).populate({
                path: 'storage.productId'
            }).then(warehouseInfo => {
                if (warehouseInfo.storage[0].amount >= quantity) {
                    const totalPrice = warehouseInfo.storage[0].productId.price * quantity;
                    if (totalPrice > 0) {
                        cartItem.updateCartItem({
                            _id: retrivedCartItem._id,
                            product: retrivedCartItem.product,
                            quantity: quantity,
                            storeId: retrivedCartItem.storeId,
                            date: Date.now(),
                            totalPrice: totalPrice
                        }).then(item => {
                            shoppingCart.updateShoppingCart({
                                _id: retrivedCartItem.shoppingCart
                            }).then(updatedShoppingCart => {
                                res.status(200).send(updatedShoppingCart);
                            }).catch(err => {
                                res.status(501).send(err);
                            });
                        }).catch(err => {
                            res.status(501).send(err);
                        });
                    }
                }
            }).catch(err => {
                res.status(501).send(err);
            });
        }).catch(err => {
            res.status(501).send(err);
        });
    });

});

//--------------------checkout Order (place Order)--------------------\\
app.post('/shoppingcart/checkout', userAuthenticated, (req, res) => {
    order = new Order();
    store = new Store();
    cartItem = new CartItem();
    carOwner = new CarOwner();
    warehouse = new Warehouse();
    shoppingCart = new ShoppingCart();

    const userInfo = req.user;
    const deliveryAddress = req.body.deliveryAddress;
    const phoneNumber = req.body.phoneNumber.toString();
    // const date = req.body.date;
    const isValidOrderInfo = orderInformationValidator.validateOrderInfo({
        // deliveryAddress: deliveryAddress,
        phoneNumber: phoneNumber
    });

    if (isValidOrderInfo !== 'pass') {
        return res.status(400).send({
            Error: isValidOrderInfo
        });
    }

    const status = 'pending';
    if (userInfo.role === 'carOwner') {
        try {
            carOwner.getCarOwnerByUserId({
                user: userInfo._id
            }).populate('shoppingCart').then(owner => {
                if (owner.shoppingCart.Items.length > 0) {
                    owner.shoppingCart.Items.forEach(async (item, index) => {
                        await cartItem.getCartItem(item).then(async cart => {
                            await shoppingCart.createShoppingCart({}).then(async createdShoppingCartForStore => {
                                cart.shoppingCart = createdShoppingCartForStore._id;
                                await cart.save().then(async savedCart => {
                                    await shoppingCart.addCartItem(createdShoppingCartForStore._id, savedCart).then(async OrderCart => {
                                        order.createOrder({
                                            shoppingCart: OrderCart,
                                            deliveryAddress: deliveryAddress,
                                            phoneNumber: phoneNumber,
                                            carOwnerId: owner._id,
                                            // date: date,
                                            status: status,
                                            storeId: cart.storeId
                                        }).then(async createdOrderForStore => {
                                            await carOwner.addOrder(
                                                userInfo._id,
                                                createdOrderForStore
                                            ).then(async (savedOwner) => {
                                                await store.addOrder(savedCart.storeId, createdOrderForStore._id)
                                                    .then(async addedOrderToStore => {
                                                        if (index === owner.shoppingCart.Items.length - 1) {
                                                            await carOwner.clearShoppingcart(owner._id).then(clearedShoppingCart => {
                                                                res.send(addedOrderToStore);
                                                            });
                                                        }
                                                    }).catch(err => {
                                                        res.status(404).send(err);
                                                    });
                                            }).catch(err => {
                                                res.status(404).send(err);
                                            });
                                        }).catch(err => {
                                            res.status(404).send(err);
                                        });
                                    }).catch(err => {
                                        res.status(404).send(err);
                                    });
                                }).catch(err => {
                                    res.status(404).send(err);
                                });
                            }).catch(err => {
                                res.status(404).send(err);
                            });
                        }).catch(err => {
                            res.status(404).send(err);
                        });
                    });
                } else {
                    res.status(400).send({
                        Error: 'You must have at least one item in your shoppingcart'
                    });
                }
            }).catch(err => {
                res.status(404).send(err);
            });
        } catch (err) {
            res.status(404).send(err);
        }

    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

//------------------------maintain order------------------------\\
app.put('/maintain/order/:orderId', userAuthenticated, (req, res) => {
    carOwner = new CarOwner();
    warehouse = new Warehouse();
    shoppingCart = new ShoppingCart();
    order = new Order();

    const userInfo = req.user;
    const orderId = req.params.orderId;
    const deliveryAddress = req.body.deliveryAddress;

    const phoneNumber = req.body.phoneNumber.toString();
    const isValidOrderInfo = orderInformationValidator.validateOrderInfo({
        phoneNumber: phoneNumber
    });

    if (isValidOrderInfo !== 'pass') {
        return res.status(400).send({
            Error: isValidOrderInfo
        });
    }

    date = new Date();
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId({
            user: userInfo._id
        }).then(cOwner => {
            order.getOrder(orderId).then(retrivedOrder => {
                if (retrivedOrder.status === 'pending') {
                    if (cOwner._id.equals(retrivedOrder.carOwnerId)) {
                        if ((date.getTime() - retrivedOrder.date.getTime()) <= 3600000) {
                            retrivedOrder.deliveryAddress = deliveryAddress;
                            retrivedOrder.phoneNumber = phoneNumber;
                            order.updateOrder(retrivedOrder).then(updatedOrder => {
                                res.send(updatedOrder);
                            }).catch(err => {
                                res.status(501).send(err);
                            });
                        } else {
                            res.send({
                                Error: 'You cannot update your order now accepted time has elapsed'
                            });
                        }
                    } else {
                        res.status(403).send({
                            Error: "You don't have access to this order"
                        });
                    }
                } else {
                    res.status(403).send({
                        Error: "This order is delivered or cancel"
                    });
                }
            }).catch(err => {
                res.status(501).send(err);
            });
        }).catch(err => {
            res.status(501).send(err);
        });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

//----------------------get Stores that belong to garage owner----------------------\\
app.get('/garageowner/stores', userAuthenticated, (req, res) => {
    store = new Store();
    garageOwner = new GarageOwner();
    userInfo = req.user;
    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(retrivedGarageOwner => {
            console.log(retrivedGarageOwner._id);
            store.getStoresAssociatedWithGarageOwner(retrivedGarageOwner._id).then(retrivedStores => {
                res.send(retrivedStores);
            }).catch(err => {
                res.status(404).send(err);
            });
        }).catch(err => {
            res.status(404).send(err);
        });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

//----------------------get Orders from Store----------------------\\
app.get('/store/:storeId/orders', userAuthenticated, (req, res) => {
    garageOwner = new GarageOwner();
    order = new Order();

    const userInfo = req.user;
    const storeId = req.params.storeId;
    const status = req.query.status;

    const limitAndSkipValidater = limitAndSkipValidation.validateLimitAndSkip(req.query.limit, req.query.skip);
    if (limitAndSkipValidation.validateLimitAndSkip(req.query.limit, req.query.skip) !== 'pass') {
        return res.status(400).send({
            Error: limitAndSkipValidater
        });
    }

    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);

    if (skip < 0) {
        return res.status(400).send({
            Error: 'skip must be equal or more than zero'
        });
    }

    if (limit <= 0) {
        return res.status(400).send({
            Error: 'limit must be more than zero'
        });
    }

    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(garageOwnerInfo => {
            if (garageOwnerInfo.stores.includes(storeId)) {
                if (status) {
                    if (status === 'pending' || status === 'cancel' || status === 'delivered') {
                        order.getOrdersByStoreIdAndStatus(storeId, status, limit, skip)
                            .then(orders => {
                                if (orders.length > 0) {
                                    return res.send(orders);
                                } else {
                                    return res.status(404).send({
                                        Error: `there is no ${status} orders in your stores`
                                    });
                                }
                            });
                    } else {
                        return res.status(400).send({
                            Error: 'status is wrong it must be pending or cancel or delivered'
                        });
                    }
                } else {
                    order.getOrdersByStoreId(storeId, limit, skip)
                        .then(orders => {
                            return res.send(orders);
                        });
                }
            } else {
                res.status(404).send({
                    Error: 'store does not belong to this garage owner'
                });
            }
        }).catch(err => {
            res.status(404).send({
                Error: 'garageOwner is not exits'
            });
        });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

//----------------------get Order from Store----------------------\\
app.get('/store/:storeId/order/:orderId', userAuthenticated, (req, res) => {
    shoppingCart = new ShoppingCart();
    cartItem = new CartItem();
    store = new Store();
    garageOwner = new GarageOwner();

    const userInfo = req.user;
    const storeId = req.params.storeId;
    const orderId = req.params.orderId;

    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(garageOwnerInfo => {
            if (garageOwnerInfo.stores.includes(storeId)) {
                store.getOrderFromeStore(storeId, orderId)
                    .populate('orders')
                    .then(storeInfo => {
                        if (storeInfo.orders.length > 0) {
                            res.send(storeInfo.orders);
                        } else {
                            res.status(404).send({
                                Error: 'order does not exists'
                            });
                        }
                    }).catch(err => {
                        res.status(404).send({
                            Error: 'order does not exists'
                        });
                    });
            } else {
                res.status(404).send({
                    Error: 'store does not belong to this garage owner'
                });
            }
        });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

//----------------processing order (accept order by garage owner or cancel the order)----------------\\
app.put('/store/:storeId/order/:orderId', userAuthenticated, (req, res) => {
    garageOwner = new GarageOwner();
    store = new Store();
    warehouse = new Warehouse();
    shoppingCart = new ShoppingCart();
    order = new Order();
    report = new Report();

    const userInfo = req.user;
    const status = req.body.status;
    const orderId = req.params.orderId;
    const storeId = req.params.storeId;

    date = new Date();

    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(gaOwner => {
            order.getOrder(orderId).then(retrivedOrder => {
                if (retrivedOrder.status === "pending") {
                    if ((date.getTime() - retrivedOrder.date.getTime()) <= 3600000) {
                        if (status === 'delivered') {
                            store.updateOrderStatus(storeId, orderId, status)
                                .then(storeOrder => {
                                    shoppingCart.getShoppingCart(storeOrder.shoppingCart).populate('Items').then(retrivedSoppingCart => {
                                        store.getStore(storeId).then(retrivedStore => {
                                            retrivedSoppingCart.Items.forEach((item, index) => {
                                                warehouse.decreaseAmaountOfProduct(retrivedStore.warehouse, item.product, item.quantity).then(updatedWarehouse => {
                                                    report.addOrder(gaOwner.reportId, orderId).then(updatedReport => {
                                                        if (index === retrivedSoppingCart.Items.length - 1) {
                                                            res.status(200).send(storeOrder);
                                                        }
                                                    }).catch(err => {
                                                        res.status(501).send('Error in the report');
                                                    });
                                                }).catch(err => {
                                                    res.status(501).send('There is no available quantity in this store');
                                                });
                                            })
                                        }).catch(err => {
                                            res.status(404).send('store does not exist');
                                        });
                                    }).catch(err => {
                                        res.status(404).send('shoppingCart does not exist');
                                    });
                                }).catch(err => {
                                    res.status(404).send('Store Or order does not exist');
                                });
                        } else if (status === 'cancel') {
                            store.updateOrderStatus(storeId, orderId, status)
                                .then(storeOrder => {
                                    res.status(200).send(storeOrder);
                                }).catch(err => {
                                    res.status(404).send('Store Or order does not exist');
                                });
                        }
                    } else {
                        res.send({
                            Error: 'The user has 1 hour to update the order you need to wait one hour to have the ability to update the order status'
                        });
                    }
                } else {
                    res.send({
                        Error: 'The Order is Already processed'
                    });
                }
            }).catch(err => {
                res.status(404).send('There is no order in this id');
            });
        });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

app.post('/create/report', (req, res) => {
    report = new Report();
    report.createReport(req.body).then(createdReport => {
        res.send(createdReport);
    });
});

//-------------------removeOrder----------------------\\
app.delete('/store/:storeId/order/:orderId', userAuthenticated, (req, res) => {
    garageOwner = new GarageOwner();
    order = new Order();
    carOwner = new CarOwner();
    shoppingCart = new ShoppingCart();
    cartItem = new CartItem();
    const userInfo = req.user;
    const storeId = req.params.storeId;
    const orderId = req.params.orderId;

    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(owner => {
                garageOwner.removeOrder(owner._id, storeId, orderId).then(updateGarageOwner => {
                        order.getOrder(orderId).then(orderInfo => {
                                carOwner.removeOrder(orderInfo.carOwnerId, orderId).then(updateCarOwner => {
                                        order.deleteOrder(orderId).then(deletedOrder => {
                                                shoppingCart.deleteShoppingCart(deletedOrder.shoppingCart).then(deletedShoppingCart => {
                                                    cartItem.deleteAllCartItemsAssociatedWithShoppingCartId(deletedOrder.shoppingCart).then(deletedCartItem => {
                                                        res.status(200).send(deletedOrder);
                                                    }).catch(err => {
                                                        res.status(501).send("Error in deleting");
                                                    });
                                                }).catch(err => {
                                                    res.status(501).send("Error in deleting");
                                                });
                                            })
                                            .catch(err => {
                                                res.status(501).send("Error in deleting");
                                            });
                                    })
                                    .catch(err => {
                                        res.status(501).send("Error in deleting");
                                    });

                            })
                            .catch(err => {
                                res.status(501).send("Error in deleting");
                            });
                    })
                    .catch(err => {
                        res.status(501).send("Error in deleting");
                    });
            })
            .catch(err => {
                res.status(501).send("Error in deleting");
            });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//---------------------search in (stores or products)---------------------\\
app.get('/search', (req, res) => {
    store = new Store();
    category = new Category();
    product = new Product();

    let reg = new RegExp(/^\d+$/);
    if (!reg.test(req.query.skip) || !reg.test(req.query.limit)) {
        return res.status(400).send({
            Error: 'limit and skip must exists and be numbers'
        });
    }

    const query = req.query.q;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const searchIn = req.query.searchIn;

    if (skip < 0) {
        return res.status(400).send({
            Error: 'skip must be equal or more than zero'
        });
    }

    if (limit <= 0) {
        // limit = 10;
        return res.status(400).send({
            Error: 'limit must be more than zero'
        });
    }

    if (query) {
        const regex = new RegExp(escapeRegex(query), 'gi');
        // const sStore = store.searchStores(regex, limit, skip);
        // const sProduct = product.searchProducts(regex, limit, skip);
        // searchResult.push(sStore);
        // searchResult.push(sProduct);

        if (searchIn === 'stores') {
            store.searchStores(regex, limit, skip).then(storesSearchResult => {
                if (storesSearchResult.length <= 0) {
                    return res.status(404).send({
                        Error: 'There is no result'
                    });
                }
                return res.send({
                    storesSearchResult
                });
            }).catch(err => {
                res.status(404).send("Error in search");
            });
        } else if (searchIn === 'products') {
            product.searchProducts(regex, limit, skip).then(productsSearchResult => {
                if (productsSearchResult.length <= 0) {
                    return res.status(404).send({
                        Error: 'There is no result'
                    });
                }
                return res.send({
                    productsSearchResult
                });
            }).catch(err => {
                res.status(404).send("Error in search");
            });
        } else {
            return res.status(400).send({
                Error: 'you must specify where you want to search in (stores or products)'
            });
        }

        // console.log(searchResult);
        // Promise.all(searchResult).then(value => {
        //     res.send({                
        //         value
        //     });
        // });

    } else {
        res.status(404).send({
            Error: 'There is no result'
        });
    }
});

// app.get('/deleteallorders', (req, res) => {
//     order = new Order();
//     cartItem = new CartItem();
//     shoppingCart = new ShoppingCart();
//     order.deleteAllOrder().then(deletedOrders => {
//         shoppingCart.deleteAllShoppingCart().then(deletedShoppingCart => {
//             cartItem.deleteAllCartItem().then(deletedCartItem => {
//                 res.status(200).send('All Orders has deleted');
//             }).catch(err => {
//                 res.status(501).send(err);
//             });
//         }).catch(err => {
//             res.status(501).send(err);
//         });
//     }).catch(err => {
//         res.status(501).send(err);
//     });
// });

//----------------------delete this----------------------
// app.post('/create-product', (req, res) => {
//     WarehouseModel.getWarehouse({
//         _id: req.body.warehouseId
//     }).then((warehouse) => {
//         ProductModel.createProduct({
//             name: req.body.name,
//             price: req.body.price,
//             image: req.body.image,
//             categoryId: req.body.categoryId,
//             productType: req.body.productType,
//             description: req.body.description
//         }).then((product) => {
//             warehouse.storage.push({
//                 productId: product,
//                 amount: req.body.amount
//             });
//             warehouse.save().then(savedProduct => {
//                 res.json("product is saved");
//             });
//         });

//     });
// });

// app.post('/create-category', (req, res) => {
//     CategoryModel.createCategory({
//         name: req.body.name,
//         image: req.body.image,
//         storeId: req.body.storeId
//     });
//     res.json("category is saved");
// });



//----------Create garageowner----------
app.post('/user/garage-owner/create', (req, res) => {
    const user = req.body.user;
    const store = req.body.store;

    SignUp.createGarageOwner(res, user, store);
});


//----------Create Category----------
app.post('/store/:id/create-category', (req, res) => {
    //Defining needed objects
    category = new Category();
    menu = new Menu();
    //Checking if there is a category with the provided name
    const categoryPromiseResult = category.findCategoryByName(req.body.name);
    categoryPromiseResult.then(categoryFindResult => {
        // If there aren't any categories with that name inside the store, begin the creating process
        if (categoryFindResult.length == 0 || categoryFindResult[0].storeId != req.params.id) {
            //1- Creating category with the provided information
            const createPromiseResult = category.createCategory({
                    name: req.body.name,
                    storeId: req.params.id,
                    image: req.body.image
                })
                .then(categoryCreateResult => {
                    //2- Adding a ref for the new category to the store's menu
                    menu.addCategory(req.params.id, categoryCreateResult)
                        .then(menuResult => {
                            res.send(categoryCreateResult);
                        })
                        .catch(err => {
                            category.removeCategory(categoryCreateResult._id);
                            res.send({
                                error: "Error updating menu.  " + err
                            });
                        });
                })
                .catch(err => res.send({
                    error: "Error creating category.  " + err
                }));
        }
        // Else it will a return a response that it already exists
        else
            res.send("A category with that name already exists");
    }).catch(err => res.send({
        error: "Error getting category Name.   " + err
    }));
});

//----------Update Category----------
app.put('/store/:id/update-category/:categoryId', (req, res) => {
    //Defining needed objects
    category = new Category();
    //Checking if the category exists by it's ID
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    " + err));
    //Checking if there is a category with the name that the user provided in the update information
    const categoryPromiseResultName = category.findCategoryByName(req.body.name);
    categoryPromiseResultName.then(categoryFindResult => {
        // If there aren't any categories with that name inside the store, begin the updating process
        if (categoryFindResult.length == 0 || categoryFindResult[0].storeId != req.params.id) {
            //1- Update the category with the ID with the new provided information
            category.updateCategory({
                    _id: req.params.categoryId,
                    name: req.body.name,
                    image: req.body.image
                })
                .then(categoryUpdateResult => {
                    //2- After the update finishes, find the updated category by its ID then return it to the user
                    category.findCategoryById(req.params.categoryId)
                        .then(categoryFindResult => {
                            res.send(categoryFindResult);
                        })
                        .catch(err => res.send({
                            error: "Error finding category.  " + err
                        }))
                })
                .catch(err => res.send({
                    error: "Error updating category.  " + err
                }));
        }
        // Else it will a return a response that it already exists
        else
            res.send("A category with that name already exists");
    }).catch(err => res.send("Error getting category name.    " + err))
});

//----------Delete Category----------
app.delete('/store/:id/delete-category/:categoryId', (req, res) => {
    //Defining the needed objects
    category = new Category();
    product = new Product();
    menu = new Menu();
    warehouse = new Warehouse();
    //Checking if the category exists by it's ID
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    " + err));
    //Startting the process of deleting the category
    //1- Getting all the categories from the store's menu
    menu.getAllCategories(req.params.id)
        .then(menuResult => {
            //2- Updating the categories list inside the store's list 
            console.log("Menu result: \n" + menuResult.categories)
            const index = menuResult.categories.indexOf(req.params.categoryId);
            menuResult.categories.splice(index, 1);
            menu.updateMenu({
                    storeId: menuResult.storeId,
                    categories: menuResult.categories
                })
                .then(updateMenuResult => {
                    //3- Removing the category    
                    category.removeCategory(req.params.categoryId)
                        .then(categoryResult => {
                            //4- Removing the products inside that category    
                            product.removeProductsOfCategory(req.params.categoryId)
                                .then(productsResult => {
                                    //5- Removing the products from the warehouse
                                    warehouse.removeProductsFromWarehouse(req.params.id, req.params.categoryId)
                                        .then(warehouseResult => {
                                            res.send("Deleted category and its products.");
                                        })
                                        .catch(err => res.send({
                                            error: "Error removing products from warehouse.  " + err
                                        }));
                                })
                                .catch(err => res.send({
                                    error: "Error removing products of the category.  " + err
                                }))
                        })
                        .catch(err => res.send({
                            error: "Error removing products of the category.  " + err
                        }));
                })
                .catch(err => res.send({
                    error: "Error removing category from the menu.  " + err
                }));
        })
        .catch(err => res.send({
            error: "Error getting the categories of the menu.  " + err
        }));
});

//----------Create Product----------
app.post('/store/:id/category/:categoryId/product', (req, res) => {
    //Defining needed objects
    warehouse = new Warehouse();
    category = new Category();
    product = new Product();
    //Checking if the category exists by id
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    " + err));
    //Creating product
    productInfo = {
        name: req.body.product.name,
        price: req.body.product.price,
        image: req.body.product.image,
        categoryId: req.params.categoryId,
        productType: req.body.product.productType,
        description: req.body.product.description
    };
    product.createProduct(productInfo)
        .then(productResult => {
            //Adding a ref of the product to the category
            category.addProduct(req.params.categoryId, productResult)
                .then(categoryResult => {
                    //Adding the product and its quantity to the warehouse
                    warehouse.addProduct(req.params.id, productResult._id, req.params.categoryId, req.body.warehouse.amount)
                        .then(warehouseResult => {
                            res.send(productResult);
                        })
                        .catch(err => {
                            res.send({
                                error: "Error updating warehouse. " + err
                            })
                        });
                })
                .catch(err => {
                    res.send({
                        error: "Error updating category. " + err
                    })
                })
                .catch(err => {
                    res.send({
                        error: "Error creating product. " + err
                    })
                });
        });
});

//----------Update Product----------
app.put('/store/:id/category/:categoryId/product/:productId', (req, res) => {
    //Defininfg needed objects
    warehouse = new Warehouse();
    category = new Category();
    product = new Product();
    //Updating product

});

//----------Delete Product----------
app.delete('/store/:id/category/:categoryId/product/:productId', (req, res) => {
    //Defininfg needed objects
    warehouse = new Warehouse();
    category = new Category();
    product = new Product();
    //Deleting product
    product.removeProduct(req.params.productId)
        .then(deleteProductResult => {
            //2- Updating the products list inside the category's list 
            //Removing product ref from the category
            category.removeProductFromCategory(req.params.categoryId, req.params.productId)
                .then(updateCategoryResult => {
                    //Updating the warehouse
                    warehouse.removeProductFromWarehouse(req.params.id, req.params.productId)
                        .then(warehouseResult => {
                            res.send("Deleted product and updated warehouse and category")
                        })
                        .catch(err => res.send({
                            error: "Error updating warehouse. " + err
                        }));
                })
                .catch(err => res.send({
                    error: "Error updating category. " + err
                }));
        })
        .catch(err => res.send({
            error: "Error deleting product. " + err
        }));
});

//----------View Categories of a store----------
app.get('/store/:id/categories', (req, res) => {
    //Defining needed objects
    menu = new Menu();
    //Getting the categories list from that menu
    menu.getAllCategories(req.params.id).populate("categories")
        .then(categoriesResult => {
            console.log(categoriesResult);
            res.send(categoriesResult)
        })
        .catch(err => res.send({
            error: "Error getting categories of the requested store. " + err
        }));
});

//----------View products of a category----------
app.get('/store/:id/category/:categoryId/products', (req, res) => {
    //Defining needed objects
    category = new Category();
    //Checking if the category exists by it's ID
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    " + err));
    //Getting the products of that category
    category.getProductsOfCategory(req.params.categoryId)
        .then(productsResult => res.send(productsResult))
        .catch(err => res.send({
            error: "Error getting products of the requested category. " + err
        }));
});

//----------View a product----------
app.get('/store/:id/category/:categoryId/products/productId', (req, res) => {
    product = new Product();

    category = new Category();
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    " + err));

    product.getAllProducts(req.body.categoryId)
        .then(productsResult => res.send(productsResult))
        .catch(err => res.send({
            error: "Error getting products of the requested category. " + err
        }));
});

//----------View a caregory----------
app.get('/store/:id/category/:categoryId', (req, res) => {
    category = new category();
    category.findCategoryById(req.params.categoryId)
        .then(categoryResult => res.send(categoryResult))
        .catch(err => {
            error: "Error getting the requested category. " + err
        });
});

module.exports = app;

/*
app.post('/user/car-owner/create', (req, res) => {
    const user = req.body.user;
    const car = req.body.car;

    SignUp.createCarOwner(res,user,car);
});

app.put('/update-menu/:id', (req, res) => {
    console.log("Inside put")

    Menu.updateMenu({
        _id:req.params.id,
        temp:req.body.temp,
    });
    res.send("Updated Menu");
});
*/

/*
---------------------------------CAR--------------------------------

app.post('/create-car',(req,res) =>
{
    const promiseResult = Car.createCar(res,{
                    ...req.body
                });
    console.log("result: ")
    promiseResult.then(result => console.log(result));
});


app.put('/update-car/:id',(req,res) =>
{
    Car.updateCar(res,{
                _id:req.params.id,
                userId:req.body.userId,
                model:req.body.model,
                make:req.body.make,
                year:req.body.year
            });
});

app.delete('/delete-car/:id',(req,res) =>
{
    Car.deleteCar(res,{_id:req.params.id});
});
*/

/*
---------------------------------CATEGORY--------------------------------
app.post('/create-category',(req,res) =>
{
    Category.createCategory(res,{
                name:req.body.name,
                image:req.body.image,
                storeId:req.body.storeId
            });
});

app.put('/update-category/:id',(req,res) =>
{
    Category.updateCategory(res,{
                _id:req.params.id,
                name:req.body.name,
                image:req.body.image,
                storeId:req.body.storeId
            });
});

app.get('/get-category/:id',(req,res) =>
{
    Category.getCategoryInfo(res,{_id:req.params.id});
});

app.delete('/delete-category/:id',(req,res) =>
{
    Category.deleteCategory(res,{_id:req.params.id});
});
*/

/*
---------------------------------MESSAGE--------------------------------
app.post('/create-message',(req,res) =>
{
    Message.createMessage(res,{
                owner:req.body.owner,
                data:req.body.data,
            });
});
*/

/*
---------------------------------PRODUCT--------------------------------
app.post('/create-product',(req,res) =>
{
    Product.createProduct(res,{
                name:req.body.name,
                price:req.body.price,
                image:req.body.image,
                categoryId:req.body.categoryId,
                productType:req.body.productType,
                description:req.body.description
            });
});

app.put('/update-product/:id',(req,res) =>
{
    Product.updateProduct(res,{
                _id:req.params.id,
                name:req.body.name,
                price:req.body.price,
                image:req.body.image,
                categoryId:req.body.categoryId,
                productType:req.body.productType,
                description:req.body.description
            });
});

app.delete('/delete-product/:id',(req,res) =>
{
    Product.deleteProduct(res,{_id:req.params.id});
});
*/

/*
---------------------------------Offer--------------------------------
app.post('/create-offer',(req,res) =>
{
    Offer.createOffer(res,{
                discountRate:req.body.discountRate,
                duration:req.body.duration
            });
});

app.put('/update-offer/:id',(req,res) =>
{
    Offer.updateOffer(res,{
                _id:req.params.id,
                discountRate:req.body.discountRate,
                duration:req.body.duration
            });
});

app.delete('/delete-offer/:id',(req,res) =>
{
    Offer.deleteOffer(res,{_id:req.params.id});
});
*/

/*
---------------------------------MENU--------------------------------
app.post('/create-menu',(req,res) =>
{
    Menu.createMenu(res,{
                storeId:req.body.storeId,
                });
});
*/

/*
---------------------------------WAREHOUSE--------------------------------
app.post('/create-warehouse',(req,res) =>
{
    Warehouse.createWarehouse(res,{
                storeId:req.body.storeId,
                });
});
*/

/*
---------------------------------COMPLAINT--------------------------------
app.post('/create-complaint',(req,res) =>
{
    Complaint.createComplaint(res,{
                message:req.body.message,
                garageId:req.body.garageId
                });
});
*/
