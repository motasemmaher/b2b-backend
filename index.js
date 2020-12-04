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
*/

const Category = require('./src/business/Category/Category');
const Product = require('./src/business/Product/Product');
const Warehouse = require('./src/business/Warehouse/Warehouse');
const Menu = require('./src/business/Menu/Menu');

// added By thaer
const ShoppingCart = require('./src/business/ShoppingCart/ShoppingCart');
const Store = require('./src/business/Store/Store');
const CarOwner = require('./src/business/CarOwner/CarOwner');
const User = require('./src/business/User/User');
const CartItem = require('./src/business/CartItem/CartItem');
const Order = require('./src/business/Order/Order');
const GarageOwner = require('./src/business/GarageOwner/GarageOwner');

const SignUp = require('./src/auth/signUp');
const login = require('./src/auth/login');
const {
    userAuthenticated
} = require('./src/middleware/authentication');
const express = require("express");
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const app = express();

app.use(bodyParser.json());
app.use(session({
    secret: 'thaer123',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


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
    // res.json({
    //     state: "User has logged in"
    // });
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

//---------get shoppingcart---------------\\
app.get('/shoppingcart', userAuthenticated, (req, res) => {
    shoppingCart = new ShoppingCart();
    cartItem = new CartItem();
    carOwner = new CarOwner();

    const userInfo = req.user;
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId({
            user: userInfo._id
        }).populate('shoppingCart').then(carOwnerInfo => {
            cartItem.getCartItemsAssociatedWithShoppingCartId(carOwnerInfo.shoppingCart._id)
                .then(retrivedCartItems => {
                    res.send(retrivedCartItems);
                }).catch(err => {
                    res.status(404).send(err);
                });
        }).catch(err => {
            res.status(404).send(err);
        });
    } else {
        res.status(403).send({Error: {Error: 'you cannot access this page'}});
    }
});

//------------------add cartItem to shoppingcart by car owner-----------------\\
app.post('/shoppingcart/addcart', userAuthenticated, (req, res) => {
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const date = req.body.date;
    const storeId = req.body.storeId;
    const userInfo = req.user;

    if (quantity <= 0) {
        res.status(501).send("Error: Quantity must be more than Zero");
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
                                    res.status(501).send(err);
                                });
                            } else {
                                res.status(501).send('Error With The Price');
                            }
                        } else {
                            res.status(501).send('Error This Quantity Is not available');
                        }
                    }).catch(err => {
                        res.status(501).send(err);
                    });
                }).catch(err => {
                    res.status(501).send(err);
                });
        }).catch(err => {
            res.status(501).send(err);
        });
    } else {
        res.status(403).send({Error: 'you cannot access this page'});
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
    const quantity = req.body.quantity;

    if (quantity <= 0) {
        res.status(501).send("Error: Quantity must be more than Zero");
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
    const phoneNumber = req.body.phoneNumber;
    const date = req.body.date;

    const status = 'pending';
    if (userInfo.role === 'carOwner') {
        try {
            carOwner.getCarOwnerByUserId({
                user: userInfo._id
            }).populate('shoppingCart').then(owner => {
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
                                        date: date,
                                        status: status
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
                                                });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        } catch (err) {
            res.status(501).send(err);
        }

    } else {
        res.status(403).send({Error: 'you cannot access this page'});
    }
});

app.put('/maintain/order', userAuthenticated, (req, res) => {

});

app.get('/store/:storeId/orders', userAuthenticated, (req, res) => {
    shoppingCart = new ShoppingCart();
    cartItem = new CartItem();
    store = new Store();
    garageOwner = new GarageOwner();

    const userInfo = req.user;
    const storeId = req.params.storeId;

    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(garageOwnerInfo => {
            if (garageOwnerInfo.stores.includes(storeId)) {
                store.getStore(storeId)
                    .populate('orders')
                    .then(storeInfo => {
                        res.send(storeInfo.orders);
                    });
            } else {
                res.status(404).send({
                    Error: 'store does not belong to this garage owner'
                });
            }

        });
    } else {
        res.status(403).send({Error: 'you cannot access this page'});
    }
});

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
                                Error: 'order does not exists or belong to this user'
                            });
                        }

                    }).catch(err => {
                        res.status(404).send({
                            Error: 'order does not exists or belong to this user'
                        });
                    });
            } else {
                res.status(404).send({
                    Error: 'store does not belong to this garage owner'
                });
            }

        });
    } else {
        res.status(403).send({Error: 'you cannot access this page'});
    }
});
//----------------processing order (accept order by garage owner or cancel the order)----------------\\
app.put('/store/:storeId/order/:orderId', userAuthenticated, (req, res) => {
    garageOwner = new GarageOwner();
    store = new Store();
    warehouse = new Warehouse();
    shoppingCart = new ShoppingCart();
    const userInfo = req.user;
    const status = req.body.status;
    const orderId = req.params.orderId;
    const storeId = req.params.storeId;

    if (userInfo.role === 'garageOwner') {
        if (status === 'delivered') {
            store.updateOrderStatus(storeId, orderId, status)
                .then(storeOrder => {
                    shoppingCart.getShoppingCart(storeOrder.shoppingCart).populate('Items').then(retrivedSoppingCart => {
                        store.getStore(storeId).then(retrivedStore => {
                            retrivedSoppingCart.Items.forEach((item, index) => {
                                warehouse.decreaseAmaountOfProduct(retrivedStore.warehouse, item.product, item.quantity).then(updatedWarehouse => {
                                    if (index === retrivedSoppingCart.Items.length - 1) {
                                        res.status(200).send(storeOrder);
                                    }
                                });
                            });
                        }).catch(err => {
                            res.status(501).send('store does not exist');
                        });
                    }).catch(err => {
                        res.status(501).send('shoppingCart does not exist');
                    });
                }).catch(err => {
                    res.status(501).send('Store Or order does not exist');
                });
        } else if (status === 'cancel') {
            store.getStoreAndOrder(storeId, orderId, status)
                .then(storeOrder => {
                    res.status(200).send(storeOrder);
                }).catch(err => {
                    res.status(501).send('Store Or order does not exist');
                });
        }
    } else {
        res.status(403).send({Error: 'you cannot access this page'});
    }
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
                                                    });
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
        res.status(403).send({Error: 'you cannot access this page'});
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