/*
const Car = require("./src/models/model/Car");
const Message = require("./src/models/model/Message");
const Category = require("./src/models/model/Category");
const Product = require("./src/models/model/Product");
const Offer = require("./src/models/model/Offer");
const Menu = require("./src/models/model/Menu");
const Warehouse = require("./src/models/model/Warehouse");
const Complaint = require("./src/models/model/Complaint");
const UserModel = require('./src/models/model/User');
const GarageOwnerModel = require('./src/models/model/GarageOwner');
const CarOwnerModel = require('./src/models/model/CarOwner');
const StoreModel = require('./src/models/model/Store');
const CarModel = require('./src/models/model/Car');
const Menu = require('./src/models/model/Menu');
const CartItemModel = require('./src/models/model/CartItem');
const ShoppingCartModel = require('./src/models/model/ShoppingCart');
const OrderModel = require('./src/models/model/Order');
const ProductModel = require("./src/models/model/Product");
const warehouseModel = require("./src/models/model/Warehouse");
*/

import ('./src/models/schema/index.js');

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

const {
    userAuthenticated
} = require('./src/middleware/authentication');



const express = require("express");
const app = express();
app.use('./public', express.static('uploads'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const cors = require('cors')
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

const passport = require('passport');

const session = require('express-session');
app.use(session({
    secret: 'thaer123',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

const bcrypt = require('bcrypt');
const upload = require('./src/shared/imageUpload');


const moment = require('moment')
const schedule = require('node-schedule');
const fs = require('fs');
const nodemailer = require('nodemailer');
//const { userInfo } = require('os');



app.put('/update-menu/:id', (req, res) => {
    console.log("Inside put")

    Menu.updateMenu({
        _id: req.params.id,
        temp: req.body.temp,
    });
    res.send("Updated Menu");
});


/*-------------------------------------------------Thaer's work start-------------------------------------------------*/

// Login User 
app.get('/user/login', (req, res) => {
    res.json({
        state: 'Hello from login page'
    });
});
/*
login.login();
app.post('/user/login', passport.authenticate('local', {
    failureRedirect: '/user/login'
}), (req, res) => {
    res.json({
        state: "User has logged in"
    });
});

app.delete('/user/logout', (req, res) => {
    req.logOut();
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
                    UserModel.getUser({
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
app.options('user/garage-owner/create');
app.options('/user/car-owner/create');
//Category CORS
app.options('/store/:id/categories'); //View Categories of a store
app.options('/store/:id/category/:categoryId'); //View a Category
app.options('/store/:id/create-category'); //Create Category
app.options('/store/:id/update-category/:categoryId'); //Update Category
app.options('/store/:id/delete-category/:categoryId'); //Delete Category
//Product CORS
//app.options('/store/:id/category/:categoryId/products'); //View Products of a store
app.options('/store/:id/category/:categoryId/products/:productId?'); //View a Product
app.options('/store/:id/category/:categoryId/create-product'); //Create Product
app.options('/store/:id/category/:categoryId/update-product/:productId'); //Update Product
app.options('/store/:id/category/:categoryId/delete-product/:productId'); //Delete Product
//User CORS
app.options('/admin/waiting-users'); //View waiting users
app.options('/admin/view-users'); //View user
app.options('/admin/waiting-users/accept/:userId'); //Accepting waiting user
app.options('/admin/waiting-users/reject/:userId'); //Rejecting waiting user
app.options('/admin/view-users/delete/:userId'); //Remove user
//Complaint CORS
app.options('/store/:id/create-complaint/:submitterId'); //Create Complaint
app.options('/view-complaints/:userId'); //View Complaints
app.options('/view-complaints/complaint/:complaintId'); //View A Complaint

function hashPassword(password)
{
    const hash =  bcrypt.hashSync(password, 10);
    return hash;
}

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
                    .catch(garageOwnerError => {
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
});

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
                   .catch(carOwnerError =>{
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
});



//----------Create Category----------
app.post('/store/:id/create-category',upload.single('image'),(req,res) => {
    const validationResult = category.validateCategoryInfo({name:req.body.name});
    if(typeof validationResult !== 'undefined')
        res.send(validationResult.err);
    else{
        //Checking if there is a category with the provided name
        const categoryPromiseResult = category.findCategoryByName(req.body.name);
        categoryPromiseResult.then(categoryFindResult =>{

            // If there aren't any categories with that name inside the store, begin the creating process
            if (categoryFindResult == null || categoryFindResult.storeId != req.params.id)
            {
                //1- Creating category with the provided information
                const createPromiseResult = category.createCategory({name:req.body.name,storeId:req.params.id,image:req.file.path })
                .then(categoryCreateResult => {
                //2- Adding a ref for the new category to the store's menu
                menu.addCategory(req.params.id,categoryCreateResult)
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
        }).catch(err => res.send({error:"Error getting category Name.   "+err}));
    }
});

//----------Update Category----------
app.put('/store/:id/update-category/:categoryId',upload.single('image'),(req,res) => {
    const validationResult = category.validateCategoryInfo({name:req.body.name});
    if(typeof validationResult !== 'undefined')
        res.send(validationResult.err);
    else{
        //Checking if the category exists by it's ID
        const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
        categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    "+err));
        //Checking if there is a category with the name that the user provided in the update information
        const categoryPromiseResultName = category.findCategoryByName(req.body.name);
        categoryPromiseResultName.then(categoryFindResult =>{
            // If there aren't any categories with that name inside the store, begin the updating process
            if (categoryFindResult == null || categoryFindResult.storeId != req.params.id)
            { 
                //1- Update the category with the ID with the new provided information
                category.updateCategory({_id:req.params.categoryId,name:req.body.name,image:req.file.path})
                .then(categoryUpdateResult =>{
                    //2- After the update finishes, find the updated category by its ID then return it to the user
                    category.findCategoryById(req.params.categoryId)
                    .then(categoryFindResult => {
                        res.send(categoryFindResult);
                    })
                    .catch(err => res.send({error:"Error finding category.  "+err}))
                })
                .catch(err => res.send({error:"Error updating category.  "+err}));
            }
            // Else it will a return a response that it already exists
            else    
                res.send("A category with that name already exists");
        }).catch(err => res.send("Error getting category name.    "+err))
    }
});

//----------Delete Category----------
app.delete('/store/:id/delete-category/:categoryId',(req,res) => {
    //Checking if the category exists by it's ID
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    "+err));
    //Startting the process of deleting the category
    //1- Getting all the categories from the store's menu
    menu.getAllCategories(req.params.id)
            .then(menuResult => {
            //2- Updating the categories list inside the store's list 
            console.log("Menu result: \n"+menuResult.categories)   
            const index = menuResult.categories.indexOf(req.params.categoryId);
            menuResult.categories.splice(index,1);
            menu.updateMenu({storeId:menuResult.storeId,categories:menuResult.categories})
                .then(updateMenuResult =>{
                //3- Removing the category    
                category.removeCategory(req.params.categoryId)
                    .then(categoryResult =>{
                    //4- Removing the products inside that category    
                    product.removeProductsOfCategory(req.params.categoryId)
                        .then(productsResult =>{
                        //5- Removing the products from the warehouse
                        warehouse.removeProductsFromWarehouse(req.params.id,req.params.categoryId)
                            .then(warehouseResult => {
                                res.send("Deleted category and its products.");
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
});

//----------Create Product----------
app.post('/store/:id/category/:categoryId/create-product',upload.single('image'),(req,res) => {
    //Checking if the category exists by id
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    "+err));
    //Creating product
    productInfo = {name:req.body.name,price:req.body.price,image:req.file.path,categoryId:req.params.categoryId,productType:req.body.productType,description:req.body.description};

    const productValidationResult = product.validateProductInfo(productInfo);
    const warehouseValidationResult = warehouse.validateWarehouseInfo({amount:req.body.amount});
    
    if(typeof productValidationResult !== 'undefined')
        res.send(productValidationResult.err);
    else if(typeof warehouseValidationResult !== 'undefined')
        res.send(warehouseValidationResult.err);
    else{
        product.createProduct(productInfo).then(productResult => {
        //Adding a ref of the product to the category
        category.addProduct(req.params.categoryId,productResult)
            .then(categoryResult =>{
            //Adding the product and its quantity to the warehouse
            warehouse.addProduct(req.params.id,productResult._id,req.params.categoryId,req.body.amount)
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
});

//----------Update Product----------
app.put('/store/:id/category/:categoryId/update-product/:productId',upload.single('image'),(req,res) => {
    productInfo = {name:req.body.name,price:req.body.price,image:req.file.path,categoryId:req.params.categoryId,productType:req.body.productType,description:req.body.description};
    const productValidationResult = product.validateProductInfo(productInfo);
    const warehouseValidationResult = warehouse.validateWarehouseInfo({amount:req.body.amount});

    if(typeof productValidationResult !== 'undefined')
        res.send(productValidationResult.err);
    else if(typeof warehouseValidationResult !== 'undefined')
        res.send(warehouseValidationResult.err);
    else{
        //Updating product
        console.log("categoryName: "+req.body.categoryName)

        category.findCategoryByName(req.body.categoryName)
        .then(categoryFindByNameResult =>{
        updatedProductInfo = {_id:req.params.productId,name:req.body.name,price:req.body.price,image:req.file.path,categoryId:categoryFindByNameResult._id,productType:req.body.productType,description:req.body.description}
        product.updateProduct(updatedProductInfo)
            .then(productResult =>{
                
            if(categoryFindByNameResult._id != req.params.categoryId) 
            {
            console.log("Inside update product if")
            category.removeProductFromCategory(req.params.categoryId,req.params.productId)
                .then(removeProductFromCategoryResult => {
                category.addProduct(updatedProductInfo.categoryId,productResult._id)
                    .then(addProductTocategoryResult =>{
                    warehouse.removeProductFromWarehouse(req.params.id,req.params.productId)
                        .then(removeProductFromWarehouseResult => {
                        warehouse.addProduct(req.params.id,req.params.productId,updatedProductInfo.categoryId,req.body.amount)
                            .then(addProductToWarehouseResult =>{
                            product.getProductById(req.params.productId)
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
            console.log("Inside update product else")
            warehouse.removeProductFromWarehouse(req.params.id,req.params.productId)
            .then(removeProductResultFromWarehouse => {
            warehouse.addProduct(req.params.id,req.params.productId,req.params.categoryId,req.body.amount)
                .then(addProductToWarehouseResult =>{
                product.getProductById(req.params.productId)
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
    });
    }
});

//----------Delete Product----------
app.delete('/store/:id/category/:categoryId/delete-product/:productId',(req,res) => {
    //Deleting product
    product.removeProduct(req.params.productId)
            .then(deleteProductResult => {
            //2- Updating the products list inside the category's list 
            //Removing product ref from the category
            category.removeProductFromCategory(req.params.categoryId,req.params.productId)
                .then(updateCategoryResult => {
                //Updating the warehouse
                warehouse.removeProductFromWarehouse(req.params.id,req.params.productId)
                    .then(warehouseResult => {
                    res.send("Deleted product and updated warehouse and category")
                    })
                    .catch(err => res.send({error:"Error updating warehouse. "+err}));
                })
                .catch(err => res.send({error:"Error updating category. "+err}));
            })
            .catch(err => res.send({error:"Error deleting product. "+err}));
});
    
/*
//----------View Stores----------
app.get('/stores',(req,res) => {
    store.getAllStores()
    .then(storesResult => {
    res.send(storesResult);
    })
    .catch(err => res.send({error:"Error getting all stores. "+err}));
});

//----------View a Store----------
app.get('/stores/:storeId',(req,res) => {
    store.getStoreById(req.params.storeId)
    .then(storesResult => {
    res.send(storesResult);
    })
    .catch(err => res.send({error:"Error getting the store. "+err}));
});
*/

/*
//----------View Categories of a store----------
app.get('/store/:id/categories',(req,res) => {
    //Getting the categories list from that menu
    menu.getAllCategories(req.params.id).populate('categories','name , image')
        .then(categoriesResult => {console.log(categoriesResult); res.send(categoriesResult)})
        .catch(err => res.send({error:"Error getting categories of the requested store. "+err}));
});
//----------View products of a category----------
app.get('/store/:id/category/:categoryId/products',(req,res) => {
    //Checking if the category exists by it's ID
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    "+err));
    //Getting the products of that category
    category.getProductsOfCategory(req.params.categoryId)
        .then(productsResult => res.send(productsResult))
        .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
});
//----------View a product----------
app.get('/store/:id/category/:categoryId/products/:productId',(req,res) => {
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    "+err));

    product.getProductById(req.params.productId)
        .then(productsResult => res.send(productsResult))
        .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
});
//----------View a category----------
app.get('/store/:id/category/:categoryId',(req,res) => {
    category.findCategoryById(req.params.categoryId).populate('products')
        .then(categoryResult => res.send(categoryResult))
        .catch(err => res.send({error:"Error getting the requested category. "+err}));
});
*/

/*
--------------------------------------User--------------------------------------
//----------Get waiting users----------
app.get('/admin/waiting-users',(req,res) => {
    user.getAllUsersIdOfARole('waitingUser')
    .then(ids => {
    garageOwner.getWaitingUsers(ids)
        .then(waitingUsersResult => {
            res.send(waitingUsersResult)
        })
        .catch(err => res.send({error:"Error getting the waiting users. "+err}));
    })
    .catch(err => res.send({error:"Error getting the users of that role. "+err}));
    
});

//----------View users----------
app.get('/admin/view-users',(req,res) => {
    user.getAllUsersIdOfARole('garageOwner')
    .then(ids => {
        garageOwner.getAllGarageOwners(ids)
        .then(garageOwnersResult => {
            carOwner.getAllCarOwners()
            .then(carOwnersResult => {
                res.send({garageOwners:garageOwnersResult,carOwners:carOwnersResult});
            })
            .catch(err => res.send({error:"Error getting the carOwners. "+err}));
        })
        .catch(err => res.send({error:"Error getting the garageOwners. "+err}));
    })
    .catch(err => res.send({error:"Error getting the users of that role. "+err}));
});

//----------Accepting waiting user----------
app.put('/admin/waiting-users/accept/:userId',(req,res) => {
    user.acceptWaitingUser(req.params.userId)
    .then(acceptanceResult => {
        res.redirect('/admin/waiting-users');
    })
    .catch(err => res.send({error:"Error accepting the waiting user. "+err}));
});

//----------Rejecting waiting user----------
app.delete('/admin/waiting-users/reject/:userId',(req,res) => {
    userId = req.params.userId;
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
                        res.redirect('/admin/waiting-users');
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
});

//----------Remove user----------
app.delete('/admin/view-users/delete/:userId',(req,res) => {
    userId = req.params.userId;
    
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
                                    res.send('Removed user');
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
});
*/

/*
--------------------------------------Complaint--------------------------------------
//----------Create Complaint----------
app.post('/store/:id/create-complaint/:submitterId',(req,res) => {
    store.getStoreById(req.params.id)
    .then(storeResult => {
    message.createMessage(req.params.submitterId,req.body.message)
    .then(messageResult => {
        complaint.createComplaint(req.params.submitterId,messageResult,storeResult.userId,req.params.id)
        .then(complaintResult => {
        res.send(complaintResult);
        //res.redirect('/store/'+req.params.id);
        })
        .catch(err => res.send({error:"Error creating the complaint. "+err}));
    })
    .catch(err => res.send({error:"Error creating the message. "+err}));
    })
    .catch(err => res.send({error:"Error getting the store. "+err}));
});

//----------View Complaints----------
app.get('/view-complaints/:userId',(req,res) => {
    user.getUserById(req.params.userId)
    .then(userResult => {
        if(userResult.role === 'admin')
        {
            complaint.getAllComplaints()
            .then(complaintResult => {
                res.send(complaintResult);
            })
            .catch(err => res.send({error:"Error getting all complaints. "+err}));
        }
        else if(userResult.role === 'garageOwner')
        {
            complaint.getGarageOwnerComplaints(req.params.userId)
            .then(complaintResult => {
                res.send(complaintResult);
            })
            .catch(err => res.send({error:"Error getting the garageOwner's complaints. "+err}));
        }
        else
            res.send("Error, the user isn't allowed to view the complaints. ");
    })
    .catch(err => res.send({error:"Error getting the user. "+err}));
});

//----------View A Complaint----------
app.get('/view-complaints/complaint/:complaintId',(req,res) => {
    complaint.getComplaint(req.params.complaintId)
    .then(complaintResult => {
        res.send(complaintResult);
    })
    .catch(err => res.send({error:"Error getting the complaint. "+err}));
});
*/

/*
--------------------------------------Report--------------------------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'b2b.report.generator@gmail.com',
    pass: 'b2bgp2020'
  }
});

//----------Send garage owner report----------
const garageOwnerReport = schedule.scheduleJob('0 0 1 * *', () => {
    fs.writeFile("./public/report.txt", "Hey there!\nfrom inside\nnodejs", (err) => {
        if(err)
            return console.log(err);
    
        user.getAllUsersIdOfARole('garageOwner')
        .then(garageOwners => {
        garageOwners.forEach(garageOwnerId => {
            user.getUserById(garageOwnerId._id)
                .then(garageOwner => {
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
                transporter.sendMail(mailOptions, function(error, info){
                    if (error)
                        console.log(error);
                    else
                        console.log('Email sent: ' + info.response); 
                    });  
                })
                .catch(err => res.send({error:"Error getting the garageOwner by id. "+err}));    
            })
        })
        .catch(err => res.send({error:"Error getting all the garage owners. "+err}));
    });            
});

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
                    transporter.sendMail(mailOptions, function(error, info){
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
*/

/*
--------------------------------------Offer--------------------------------------
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

//----------add Offer----------
app.post('/store/:id/offers/add-offer',(req,res) => {
    productOffers = req.body.productOffers;
    productOffers.forEach(productOffer =>{
        newPrice = productOffer['price'] - (productOffer['price']*(productOffer['discountRate']/100));
        offer.createOffer(productOffer['discountRate'],productOffer['duration'],newPrice)
        .then(offerResult => {
            product.addOffer(productOffer['productId'],offerResult)
            .then(productResult => {
                res.send("Added offer successfuly");
            })
            .catch(err => 
                {
                    res.send({error:"Error with adding offer to product. "+err});
                    offer.deleteOffer(offerResult._id);
                });
        })
        .catch(err => res.send({error:"Error with creating offer. "+err}));
    });    
});

//----------delete Offer----------
app.delete('/store/:id/offers/delete-offer/:offerId',(req,res) => {
    product.removeOffer(req.params.offerId)
    .then(productResult => {
    offer.deleteOffer(req.params.offerId)
        .then(offerResult => {
            res.send("Deleted offer");
        })
        .catch(err => res.send({error:"Error with deleting offer. "+err}));
    })
    .catch(err => res.send({error:"Error with removing offer from the product. "+err}));
});
*/

/*
--------------------------------------Garage Owner--------------------------------------
--------------------------------------Store--------------------------------------

*/

//----------View Garage Owner's stores----------
app.get('/user/:userId/manage-garage-owner/stores',(req, res) => {
    console.log(req.params.userId);
    store.getFullStoresByUserId(req.params.userId)
    .then(storesResult => {
        res.send(storesResult);
    })
    .catch(err => res.send({error:"Error with getting stores of the garageowner. "+err}));
});
//----------Add Store----------
app.post('/user/:userId/garage-owner/add-store',upload.single('image'),(req, res) => {

    //const userInfo = req.user;
    const userInfo = req.params.userId;

    const storeInfo = {name:req.body.name,address:req.body.address,description:req.body.description,
                       openTime:req.body.openTime,closeTime:req.body.closeTime,location:req.body.location,
                       image:req.file.path,userId:userInfo};
    console.log(storeInfo)
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
                    //garageOwner.getGarageOwnerByUserId({user:userInfo._id})
                    garageOwner.getGarageOwnerByUserId(userInfo)
                    .then(garageOwnerResult => {
                        garageOwner.addStoreToList(garageOwnerResult._id,storeResult)
                        .then(addingResult => {
                            //res.send(garageOwnerResult.stores).populate('stores').exec();
                            res.redirect(`/user/${userInfo}/manage-garage-owner/stores`);
                        })
                        .catch(addingError => {
                            store.deleteStore(storeResult._id);
                            menu.deleteMenu(menuResult._id);
                            warehouse.deleteWarehouse(warehouseResult._id);
                            res.send("Error adding store to list: "+addingError);
                        });
                    })
                    .catch(garageOwnerError => {
                        store.deleteStore(storeResult._id);
                        menu.deleteMenu(menuResult._id);
                        warehouse.deleteWarehouse(warehouseResult._id);
                        res.send("Error with getting garageOwner: "+garageOwnerError);
                    });
                    })  
                    .catch(storeError =>{
                    menu.deleteMenu(menuResult._id);
                    warehouse.deleteWarehouse(warehouseResult._id);
                    res.send("Error with creating Store: "+storeError);
                    });
                })
                .catch( warehouseError =>{
                menu.deleteMenu(menuResult._id);
                res.send("Error with creating Warehouse: "+warehouseError);
                });
            })
            .catch(menuError =>{
            res.send("Error with creating Menu: "+menuError);
            });
    }
});
//----------Update Store----------
app.put('/user/:userId/garage-owner/update-store/:storeId',upload.single('image'),(req, res) => {

    //const userInfo = req.user;
    const userInfo = req.params.userId;
    const body = req.body;    
    const storeInfo = {_id:req.params.storeId,...body,image:req.file.path};

    const storeValidationResult = store.validateStoreInfo(storeInfo);
    
    if(typeof storeValidationResult !== 'undefined')
        res.send(storeValidationResult.err);
    else
    {
        store.updateStore(storeInfo)
        .then(storeResult => {
        res.redirect(`/user/${userInfo}/manage-garage-owner/stores`);
        })
        .catch(storeError => res.send("Error with updating Store: "+storeError));
    }
});

module.exports = app;