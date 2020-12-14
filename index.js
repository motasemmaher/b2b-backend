require ('./src/models/model');

//Requiring classes
const Category = require('./src/business/Category/Category');
const Product = require('./src/business/Product/Product');
const Warehouse = require('./src/business/Warehouse/Warehouse');
const Menu = require('./src/business/Menu/Menu');
const User = require('./src/business/User/User');
const GarageOwner = require('./src/business/GarageOwner/GarageOwner');
const CarOwner = require('./src/business/CarOwner/CarOwner');
const Store = require('./src/business/Store/Store');
const Complaint = require('./src/business/Complaint/Complaint');
const Message = require('./src/business/Message/Message');
const Offer = require('./src/business/Offer/Offer');
const Car = require('./src/business/Car/Car');
const ShoppingCart = require('./src/business//ShoppingCart/ShoppingCart');

//const CarOwner = require("./src/models/model/CarOwner");
const CartItem = require("./src/models/schema/CartItem");
const SignUp = require('./src/auth/signUp');
const login = require('./src/auth/login');

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

//Setting-up express app
const app = express();
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
//Setting-up session and authintication
app.use(session({
    secret: 'thaer123',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


/*-------------------------------------------------Thaer's work start-------------------------------------------------*/

// Login User 
app.get('/user/login', (req, res) => {
    res.json({
        state: 'Hello from login page'
    });
});

login.login();
app.post('/user/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, context = {}) {
        if (err) {
            return next(err);
        }
        if (context.statusCode === 429) {
            res.set('Retry-After', String(context.retrySecs));
            return res.status(429).send(context);
        }
        if (!user) {
            return res.redirect('/user/login');
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.json('User has logged in');
        });

    })(req, res, next);
});

app.delete('/user/logout', (req, res) => {
    req.logOut();
    res.redirect('/user/login');
});



app.get('/test',userAuthenticated,(req,res) => {
    res.send(req.user);
});


/*
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

app.post('/shoppingcart', userAuthenticated, (req, res) => {
    const product = req.body.product;
    const quantity = req.body.quantity;
    const date = req.body.date;

    StoreModel.getStore({
        _id: req.body.storeId
    }).then(store => {
        WarehouseModel.getProductFromWarehouse({
            _id: store.warehouse,
            productId: product
        }).populate({
            path: 'storage.productId'
        }).then(warehouse => {
            if (warehouse.storage[0].amount >= quantity) {
                const totalPrice = warehouse.storage[0].productId.price * quantity;
                // res.json(totalPrice)
                CartItemModel.createCartItem({
                    product: product,
                    quantity: quantity,
                    date: date,
                    totalPrice: totalPrice
                }).then(item => {
                    // res.json(item);
                    UserModel.getUserById({
                        _id: req.user.id
                    }).then(user => {
                        // res.json(user);
                        if (user.role === 'carOwner') {
                            CarOwnerModel.getCarOwnerByUserId({
                                user: user._id
                            }).populate('shoppingCart').then(carOwner => {
                                // res.json(carOwner);
                                carOwner.shoppingCart.Items.push(item);
                                carOwner.shoppingCart.totalBill += item.totalPrice;
                                carOwner.shoppingCart.save().then(savedItem => {
                                    res.json(savedItem);
                                });
                            });                           
                        }
                    });
                });
            }
        });
    });
});
*/
/*-------------------------------------------------Thaer's work end-------------------------------------------------*/

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





module.exports = app;