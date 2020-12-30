//Requiring packages
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const upload = require('./src/shared/imageUpload');
const moment = require('moment')
const schedule = require('node-schedule');
const fs = require('fs');
const nodemailer = require('nodemailer');
const imageToBase64 = require('image-to-base64');
const jwt = require('jsonwebtoken');
const SignUp = require('./src/auth/signUp');
const login = require('./src/auth/login');
const {
    userAuthenticated
} = require('./src/middleware/authentication');

//Setting-up express app
const app = express();
require('dotenv').config()
const server = require('http').Server(app);
const io = require('socket.io')(server);

//Setting-up session and authintication
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

require('./src/models/model');

//Requiring classes
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
const Contact = require('./src/business/Contact/Contact');
// const Chat = require('./src/business/Chat/Chat');
const Report = require('./src/business/Report/Report');
const Complaint = require('./src/business/Complaint/Complaint');
const Message = require('./src/business/Message/Message');
const Offer = require('./src/business/Offer/Offer');
const Car = require('./src/business/Car/Car');
const Permissions = require('./src/business/Permissions/Permissions');

// validation by thaer
const orderInformationValidator = require('./src/validations/orderInformation');
const cartItemInformationValidator = require('./src/validations/cartItemInformation');
const limitAndSkipValidation = require('./src/validations/limitAndSkipValidation');
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
const contact = new Contact();
// const chat = new Chat();
const report = new Report();
const order = new Order();
const cartItem = new CartItem();
const permissions = new Permissions();

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
const { uploadFile } = require('./src/shared/upload');

//Setting-up express app
const app = express();
//Setting-up path for the static files
app.use('./public', express.static('uploads'));
//Setting-up req body parser
app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}))
//Setting-up CORS options
// const corsOptions = {
//     origin: 'http://localhost:8100',
//     methods: "*",
//     optionsSuccessStatus: 200
// }
app.use(cors())


/*-------------------------------------------------Thaer's work start-------------------------------------------------*/



// app.use(passport.initialize());
// app.use(passport.session());


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
    if (!req.user) {
        login.login(req, username, password).then(loginInfo => {
            if (loginInfo.blockFor) {
                return res.send(loginInfo);
            }
            if (loginInfo.user !== null) {
                return res.status(200).send({
                    auth: true,
                    token: loginInfo.token,
                    user: {
                        _id: loginInfo.user._id,
                        username: loginInfo.user.username,
                        role: loginInfo.user.role
                    }
                });

            } else {
                return res.status(400).send({
                    Error: 'Invalid username or password'
                });
            }

        });
    } else {
        res.send({
            msg: 'already logged in'
        });
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

//log-in & log-out CORS
app.options('*');
// app.options('/user/logout');



//Sign-up CORS
app.options('/user/garage-owner/create'); //Creating garageOwner
app.options('/user/car-owner/create'); //Creating carOwner

const createAccountRoute = require('./src/auth/signUp');
app.use(createAccountRoute);




//User CORS
app.options('/admin/waiting-users'); //View waiting users
app.options('/admin/view-users'); //View user
app.options('/admin/waiting-users/accept/:userId'); //Accepting waiting user
app.options('/admin/waiting-users/reject/:userId'); //Rejecting waiting user
app.options('/admin/view-users/delete/:userId'); //Remove user
app.options('/user/:userId/manage-user-info'); //Update User information

const userRoute = require('./src/routes/User');
app.use(userRoute);



//Category CORS
app.options('/stores/:storeId/categories/:categoryId?'); //View Categories of a store and View a Category
app.options('/stores/:storeId/create-category'); //Create Category
app.options('/stores/:storeId/update-category/:categoryId'); //Update Category
app.options('/stores/:storeId/delete-category/:categoryId'); //Delete Category

const categoryRoute = require('./src/routes/Category');
app.use(categoryRoute);



//Product CORS
app.options('/products/:productId?');//View Products and View a Product
app.options('/stores/:storeId/products/:productId?'); //View Products of store and View a Product of a Store
app.options('/stores/:storeId/category/:categoryId/products/:productId?'); //View Products of a store and View a Product of a Category
app.options('/stores/:storeId/category/:categoryId/create-product'); //Create Product
app.options('/stores/:storeId/category/:categoryId/update-product/:productId'); //Update Product
app.options('/stores/:storeId/category/:categoryId/delete-product/:productId'); //Delete Product

const productRoute = require('./src/routes/Product');
app.use(productRoute);



//Store CORS
app.options('/stores/:storeId?'); //View Stores and View a Store
app.options('/stores/nearby'); //View nearby stores (same address)
app.options('/user/:userId/manage-garage-owner/stores'); //View garageOwner's Stores
app.options('/user/:userId/manage-garage-owner/add-store'); //Add Store
app.options('/user/:userId/manage-garage-owner/update-store/:storeId'); //Update Store
app.options('/user/:userId/manage-garage-owner/delete-store/:storeId'); //Delete Store

const storeRoute = require('./src/routes/Store');
app.use(storeRoute);



//Car CORS
app.options('/user/:userId/manage-car-owner/cars'); //View carOwner's Cars
app.options('/user/:userId/manage-car-owner/add-car'); //Add Car
app.options('/user/:userId/manage-car-owner/update-car/:carId'); //Update Car
app.options('/user/:userId/manage-car-owner/delete-car/:carId'); //Delete Car

const carRoute = require('./src/routes/Car');
app.use(carRoute);



//Offer CORS
app.options('/stores/:storeId/offers'); //View offers of a Store
app.options('/stores/:storeId/offers/add-offer'); //Add Offer
app.options('/stores/:storeId/offers/delete-offer/:offerId'); //Delete Offer

const offerRoute = require('./src/routes/Offer');
app.use(offerRoute);




//Complaint CORS
app.options('/stores/:storeId/create-complaint/:submitterId'); //Create Complaint
app.options('/view-complaints/:userId'); //View Complaints

const complaintRoute = require('./src/routes/Complaint');
app.use(complaintRoute);



//--------------------------------------Report--------------------------------------
const reportTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'b2b.report.generator@gmail.com',
        pass: 'b2bgp2020'
    }
});

//----------Send garage owner report----------
const garageOwnerReport = schedule.scheduleJob('0 0 1 * *', () => {

        user.getAllUsersIdOfARole('garageOwner')
        .then(garageOwners => {
            garageOwners.forEach(garageOwnerId => {
                user.getUserById(garageOwnerId._id)
                    .then(garOwner => {
                        garageOwner.getGarageOwnerByUserId(garageOwnerId._id).then(retrivedgarageOwner => {
                            report.getReport(retrivedgarageOwner.reportId).then(retrivedReport => {
                                reportForGarageOwner = `Total Income this month ${retrivedReport.totalIncome}\nNumber of delivered orders ${retrivedReport.listOfSoldItems.length}\nNumber of cancel orders ${retrivedReport.listOfCancelItems.length}`;
                                var mailOptions = {
                                    from: 'b2b.report.generator@gmail.com',
                                    to: garOwner.email,
                                    subject: `Month:${new Date().getMonth() + 1}/${new Date().getFullYear()} Report`,
                                    text: `Hello ${garOwner.fullName}, this is the report for the current month.\n${reportForGarageOwner}\nBest wishes, B2B team`,
                                };
                                reportTransporter.sendMail(mailOptions, function (error, info) {
                                    if (error)
                                        console.log(error);
                                    else {
                                        report.clearReport(retrivedReport._id).then(clearedReport => {
                                            console.log('Email sent: ' + info.response);
                                        });
                                    }
                                });
                            });
                        });
                    })
                    .catch(err => console.log("Error in generating report -Geeting garage owner by id- ! " + err));
            })
        })
        .catch(err => console.log("Error in generating report -Geting garage owners- ! " + err));
});

//----------Send admin report----------
const adminReport = schedule.scheduleJob('0 0 1 * *', () => {

    user.getAllUsersIdOfARole('garageOwner')
        .then(garageOwners => {
            user.getAllUsersIdOfARole('carOwner')
                .then(carOwners => {
                    user.getAllUsersIdOfARole('waitingUser')
                        .then(waitingUsers => {
                            reportForAdmin = `#of Garage Owners: ${garageOwners.length}\n#of Car Owners: ${carOwners.length}\n#of Waiting Users: ${waitingUsers.length}\n`;
                            user.getAllUsersIdOfARole('admin')
                                .then(admins => {
                                    admins.forEach(adminId => {
                                        user.getUserById(adminId._id)
                                            .then(admin => {
                                                fs.writeFile("./public/admin-report.txt", reportForAdmin, (err) => {
                                                    if (err)
                                                        return console.log(err);
                                                });
                                                var mailOptions = {
                                                    from: 'b2b.report.generator@gmail.com',
                                                    to: admin.email,
                                                    subject: `Admin,Month:${new Date().getMonth() + 1}/${new Date().getFullYear()} Report`,
                                                    text: `Hello ${admin.fullName},this is the report for the current month.\nBest wishes, B2B team`,
                                                    attachments: [{
                                                        filename: `admin-report#${new Date().getMonth() + 1}/${new Date().getFullYear()}.txt`,
                                                        path: './public/admin-report.txt'
                                                    }]
                                                };
                                                reportTransporter.sendMail(mailOptions, function (error, info) {
                                                    if (error)
                                                        console.log(error);
                                                    else
                                                        console.log('Email sent: ' + info.response);
                                                });
                                            })
                                            .catch(err => res.send({
                                                error: "Error getting the admin by id. " + err
                                            }));
                                    }); //End of for each
                                })
                                .catch(err => res.send({
                                    error: "Error getting all the admins owners. " + err
                                }));
                        })
                        .catch(err => res.send({
                            error: "Error getting all the waiting users. " + err
                        }));
                })
                .catch(err => res.send({
                    error: "Error getting all the car owners. " + err
                }));
        })
        .catch(err => res.send({
            error: "Error getting all the garage owners. " + err
        }));
});

app.get('/products/:productId?', (req, res) => {
    let nameSort = parseInt(req.query.nameSort);
    let priceSort = parseInt(req.query.priceSort);

    if (req.params.productId == null) {
        let skip = req.query.skip;
        let limit = req.query.limit;
        const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
        skip = limitAndSkipValues.skip;
        limit = limitAndSkipValues.limit;

        if (nameSort == null)
            nameSort = 0;
        if (priceSort == null)
            priceSort = 0;

        product.getAllProducts(limit, skip, nameSort, priceSort)
            .then(productResults => {
                product.countAll()
                    .then(countResult => {
                        // productsArray = productResults;
                        return res.status(200).send({
                            count: countResult,
                            products: productResults,
                        });
                        // .forEach((productResult,index,productsArray) => {
                        //     imageToBase64(productResult.image)
                        //     .then(base64Image => {
                        //     productResult.image = base64Image;       
                        //     if(index  === productsArray.length - 1)
                        //         res.send({productsCountByStore:countResult,products:productsArray});
                        //     })
                        //     .catch(err => {
                        //         console.log({error:"Error converting image.    "+err})
                        //         if (!res.headersSent)
                        //         res.send({count:countResult,products:productsArray});
                        //     });  
                        //     }) //End of foreach
                    })
                // .catch((err => res.send({error:"Error getting count of all products. "+err})));
            })
            .catch(err => res.send({
                error: "Error getting all products. " + err
            }));
    } else {
        product.getProductById(req.params.productId)
            .then(productResult => {
                if (productResult == null)
                    res.send({
                        error: "Error! Didn't find a product with that id."
                    });
                else {
                    return res.send(productResult);
                    // imageToBase64(productResult.image)
                    //     .then((base64Image) => {
                    //         product.image = base64Image;
                    //         res.send(productResult);
                    //     })
                    //     .catch(err => res.send({
                    //         error: "Error converting image.    " + err
                    //     }));
                }
            })
            .catch(err => res.send({
                error: "Error getting products of the requested category. " + err
            }));
    }

});


//--------------------Chat--------------------\\
let userForChat = new Set();

app.post('/user/contact/create', userAuthenticated, (req, res) => {
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

var chatIO = io.of('/user/chat/start')
    .on('connection', (socket) => {
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
/* // In Routes
//---------get shoppingcart---------------\\
app.get('/shopping-cart', userAuthenticated, (req, res) => {
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);

    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    const userInfo = req.user;
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId({
            user: userInfo._id
        }).populate('shoppingCart').then(carOwnerInfo => {
            cartItem.getCartItemsAssociatedWithShoppingCartId(carOwnerInfo.shoppingCart._id, limit, skip).populate('product')
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
app.get('/shopping-cart/cart-item/:cartItemId', userAuthenticated, (req, res) => {
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
app.post('/shopping-cart/add-cart/:storeId/:productId', userAuthenticated, (req, res) => {
    const productId = req.params.productId;
    const storeId = req.params.storeId;
    const date = req.body.date;
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
    let productPrice = 0;
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId(userInfo._id).then(carOwnerInfo => {
            store.getStore(storeId)
                .then(storeInfo => {
                    product.findProductAndItsOffer(productId).then(productWithOffer => {
                        console.log(productWithOffer);
                        if (productWithOffer.offer != null) {
                            if (offer.exists(productWithOffer.offer._id)) {
                                productPrice = productWithOffer.offer.newPrice;
                            }
                        } else {
                            productPrice = productWithOffer.price;
                        }
                        warehouse.getProductFromWarehouse(
                            storeInfo.warehouse, productId
                        ).populate({
                            path: 'storage.productId'
                        }).then(warehouseInfo => {
                            if (warehouseInfo.storage[0].amount >= quantity) {
                                const totalPrice = productPrice * quantity;
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
                            return res.status(404).send({
                                err: 'warehouse is not found'
                            });
                        });
                    }).catch(err => {
                        return res.status(400).send('product id not found');
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
app.delete('/shopping-cart/remove-cart-item/:cartItemId', userAuthenticated, (req, res) => {
    const cartItemId = req.params.cartItemId;

    cartItem.getCartItem(cartItemId).then(retrivedCartItem => {
        shoppingCart.removeCartItem(retrivedCartItem.shoppingCart, cartItemId).then(updatedShoppingCart => {
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
    }).catch(err => {
        res.status(404).send({
            error: 'there is no cartItem in this id'
        });
    });
});

//------------update cartitem by car owner-----------\\
app.put('/shopping-cart/update-cart-item/:cartItemId', userAuthenticated, (req, res) => {
    const cartItemId = req.params.cartItemId;

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

    cartItem.getCartItem(cartItemId).then(retrivedCartItem => {
        store.getStore(retrivedCartItem.storeId).then(storeInfo => {
            warehouse.getProductFromWarehouse(
                storeInfo.warehouse, retrivedCartItem.product
            ).populate({
                path: 'storage.productId'
            }).then(warehouseInfo => {
                // console.log(warehouseInfo);
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
            res.status(404).send({
                error: 'store is not exists'
            });
        });
    });

});

//--------------------checkout Order (place Order)--------------------\\
app.post('/shopping-cart/checkout', userAuthenticated, (req, res) => {

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
    let errors = [];
    if (userInfo.role === 'carOwner') {
        try {
            carOwner.getCarOwnerByUserId(userInfo._id).populate('shoppingCart').then(owner => {
                if (owner.shoppingCart.Items.length > 0) {
                    owner.shoppingCart.Items.forEach(async (item, index) => {
                        await cartItem.getCartItem(item).then(async cart => {
                            await store.getStore(cart.storeId).then(async retrivedStore => {
                                await warehouse.getProductFromWarehouse(retrivedStore.warehouse, cart.product).then(async retrivedStorage => {
                                    if (retrivedStorage.storage[0].amount >= cart.quantity) {
                                        if (retrivedStorage.storage[0].amount === cart.quantity) {
                                            await product.getProductById(cart.product).then(async retrivedProduct => {
                                                retrivedProduct[0].isInStock = false;
                                                await product.updateProduct(retrivedProduct[0]).then(async updatedProduct => {
                                                    await warehouse.decreaseAmaountOfProduct(retrivedStore.warehouse, cart.product, cart.quantity).then(async updatedWarehouse => {
                                                        await shoppingCart.createShoppingCart({}).then(async createdShoppingCartForStore => {
                                                            cart.shoppingCart = createdShoppingCartForStore._id;
                                                            await cart.save().then(async savedCart => {
                                                                await shoppingCart.addCartItem(createdShoppingCartForStore._id, savedCart).then(async OrderCart => {
                                                                    await order.createOrder({
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
                                                        res.status(400).send('There is no available quantity in this store');
                                                    });
                                                }).catch(err => {
                                                    res.status(400).send({
                                                        Error: 'error in updating product'
                                                    });
                                                });
                                            }).catch(err => {
                                                res.status(400).send({
                                                    Error: 'error getting product By Id in updating product'
                                                });
                                            });
                                        } else {
                                            await warehouse.decreaseAmaountOfProduct(retrivedStore.warehouse, cart.product, cart.quantity).then(async updatedWarehouse => {
                                                await shoppingCart.createShoppingCart({}).then(async createdShoppingCartForStore => {
                                                    cart.shoppingCart = createdShoppingCartForStore._id;
                                                    await cart.save().then(async savedCart => {
                                                        await shoppingCart.addCartItem(createdShoppingCartForStore._id, savedCart).then(async OrderCart => {
                                                            await order.createOrder({
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
                                                res.status(400).send('There is no available quantity in this store');
                                            });
                                        }
                                    } else {
                                        errors[cart.product] = 'error in quantity of product ' + cart.product + 'there is no available quantity';
                                        res.status(400).send('There is no available quantity in this store');
                                    }
                                }).catch(err => {
                                    return res.status(404).send('There no available quantity in this store');
                                });

                            }).catch(err => {
                                return res.status(404).send('There is no store');
                            });

                        }).catch(err => {
                            res.status(404).send(err);
                        });
                    });
                } else {
                    res.status(400).send({
                        Error: 'You must have at least one cart in your shoppingcart'
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
                        if ((date.getTime() - retrivedOrder.date.getTime()) >= 3600000) {
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
// app.get('/garageowner/stores', userAuthenticated, (req, res) => {
//     userInfo = req.user;
//     if (userInfo.role === 'garageOwner') {
//         garageOwner.getGarageOwnerByUserId(userInfo._id).then(retrivedGarageOwner => {
//             console.log(retrivedGarageOwner._id);
//             store.getStoresAssociatedWithGarageOwner(retrivedGarageOwner._id).then(retrivedStores => {
//                 res.send(retrivedStores);
//             }).catch(err => {
//                 res.status(404).send(err);
//             });
//         }).catch(err => {
//             res.status(404).send(err);
//         });
//     } else {
//         res.status(403).send({
//             Error: 'you cannot access this page'
//         });
//     }
// });

//----------------------get Orders from Store----------------------\\
app.get('/store/:storeId/orders', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    const storeId = req.params.storeId;
    const status = req.query.status;

    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);

    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

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

    const userInfo = req.user;
    const status = req.body.status;
    const orderId = req.params.orderId;
    const storeId = req.params.storeId;

    date = new Date();

    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(gaOwner => {
            order.getOrder(orderId).then(retrivedOrder => {
                if (retrivedOrder.status === "pending") {
                    if ((date.getTime() - retrivedOrder.date.getTime()) >= 3600000) {
                        if (status === 'delivered' || status === 'cancel') {
                        store.updateOrderStatus(storeId, orderId, status)
                            .then(updatedOrderStatus => {
                                shoppingCart.getShoppingCart(updatedOrderStatus.shoppingCart).populate('Items').then(retrivedSoppingCart => {
                                    store.getStore(storeId).then(retrivedStore => {
                                        retrivedSoppingCart.Items.forEach((item, index) => {
                                            if (status === 'delivered') {
                                                // warehouse.decreaseAmaountOfProduct(retrivedStore.warehouse, item.product, item.quantity).then(updatedWarehouse => {
                                                if (index === retrivedSoppingCart.Items.length - 1) {
                                                    report.addOrder(gaOwner.reportId, orderId).then(updatedReport => {
                                                        res.status(200).send(updatedOrderStatus);
                                                    }).catch(err => {
                                                        res.status(501).send('Error in the report');
                                                    });
                                                }
                                                // }).catch(err => {
                                                //     res.status(400).send('There is no available quantity in this store');
                                                // });
                                            } else if (status === 'cancel') {
                                                warehouse.increaseAmaountOfProduct(retrivedStore.warehouse, item.product, item.quantity).then(updatedWarehouse => {
                                                    product.getProductById(item.product).then(retrivedProduct => {
                                                        retrivedProduct[0].isInStock = true;
                                                        product.updateProduct(retrivedProduct[0]).then(updatedProduct => {
                                                            if (index === retrivedSoppingCart.Items.length - 1) {
                                                                report.addCancelOrder(gaOwner.reportId, orderId).then(updatedReport => {
                                                                    return res.status(200).send(updatedOrderStatus);
                                                                }).catch(err => {
                                                                    return res.status(500).send('Error in the add Cancel Order to report');
                                                                });
                                                            }
                                                        })
                                                        .catch(err => {
                                                            return res.status(400).send({
                                                                Error: 'error in increaseAmaountOfProduct'
                                                            });
                                                        });
                                                        }).catch(err => {
                                                        return res.status(400).send({
                                                            Error: 'error in updateProduct in processing order'
                                                        });
                                                    });
                                                    }).catch(err => {
                                                        return res.status(400).send({
                                                            Error: 'error in get Product By Id in processing order'
                                                        });
                                                    });                                                                                                    
                                            }
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
                        }
                        // } else if (status === 'cancel') {
                        //     store.updateOrderStatus(storeId, orderId, status)
                        //         .then(updatedOrderStatus => {
                        //             warehouse.increaseAmaountOfProduct().then().catch();
                        //             report.addCancelOrder(gaOwner.reportId, orderId).then(updatedReport => {
                        //                 res.status(200).send(updatedOrderStatus);
                        //             }).catch(err => {
                        //                 res.status(501).send('Error in the report');
                        //             });
                        //         }).catch(err => {
                        //             res.status(404).send('Store Or order does not exist');
                        //         });
                        // }
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

//---------------delete this------------\\
app.post('/create/report', (req, res) => {
    report.createReport(req.body).then(createdReport => {
        res.send(createdReport);
    });
});

//-------------------removeOrder----------------------\\
app.delete('/store/:storeId/order/:orderId', userAuthenticated, (req, res) => {
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
                                                        res.status(200).send({
                                                            msg: "successfully deleted order"
                                                        });
                                                    }).catch(err => {
                                                        res.status(500).send("Error in deleting cartItem");
                                                    });
                                                }).catch(err => {
                                                    res.status(500).send("Error in deleting shoppingCart");
                                                });
                                            })
                                            .catch(err => {
                                                res.status(500).send("Error in deleting order");
                                            });
                                    })
                                    .catch(err => {
                                        res.status(500).send("Error in deleting order from carOwner");
                                    });

                            })
                            .catch(err => {
                                res.status(500).send("Error in getting order");
                            });
                    })
                        .catch(err => {
                            res.status(501).send("Error in deleting");
                        });

                })
                    .catch(err => {
                        res.status(500).send("Error in deleting order from store");
                    });
            })
                .catch(err => {
                    res.status(501).send("Error in deleting");
                });
        })
            .catch(err => {
                res.status(500).send("Error in getting garageOwner");
            });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

app.get('/user/carowner/orders', userAuthenticated, (req, res) => {
    const userInfo = req.user;

    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);

    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId(userInfo._id).then(cOwner => {
            order.getOrderByCarOwnerId(cOwner._id, limit, skip)
                .then(orders => {
                    res.send(orders);
                })
                .catch(err => {
                    res.status(404).send({
                        Error: 'this carOwner is not found'
                    });
                });
        }).catch(err => {
            res.status(404).send({
                Error: 'this user is not found'
            });
        });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});
//------------------this method for retrived order to car owner------------------\\
app.get('/user/carowner/orders/order/:orderId', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    const orderId = req.params.orderId;
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId(userInfo._id).then(cOwner => {
            carOwner.getOrder(cOwner._id, orderId).then(orderId => {
                order.getOrder(orderId).then(retrivedOrder => {
                    res.send(retrivedOrder);
                }).catch(err => {
                    res.status(404).send({
                        Error: 'thisorder is not found'
                    });
                });
            }).catch(err => {
                res.status(404).send({
                    Error: 'this car owner is not found'
                });
            });
        }).catch(err => {
            res.status(404).send({
                Error: 'this user is not found'
            });
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
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);

    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    const search = req.query.search;
    const fliter = req.query.fliter;

    if (search) {
        const regex = new RegExp(escapeRegex(search), 'gi');
        if (fliter === 'stores') {
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
        } else if (fliter === 'products') {
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

    } else {
        res.status(404).send({
            Error: 'There is no result'
        });
    }
});

app.get('/permissions', (req, res) => {
    const role = req.query.role;
    if (role === 'admin' || role === 'carOwner' || role === 'garageOwner' || role === 'waitingUser') {
        permissions.findPermissions(role).then(permission => {
            res.send(permission);
        });
    } else {
        res.status(400).send({
            Error: 'role must be one those (admin or carOwner or garageOwner or waitingUser)'
        });
    }
});

app.put('/permissions/role/:role/add/:permission', (req, res) => {
    const role = req.params.role;
    const permission = req.params.permission;
    if (!permission) {
        return res.status(400).send({
            Error: 'error in permission param'
        });
    }
    if (role === 'admin' || role === 'carOwner' || role === 'garageOwner' || role === 'waitingUser') {
        permissions.addPermission(role, permission).then(addedPermission => {
            res.send({
                msg: 'added successfully'
            });
        });
    } else {
        res.status(400).send({
            Error: 'role must be one those (admin or carOwner or garageOwner or waitingUser)'
        });
    }
});

app.put('/permissions/autoAdding', (req, res) => {
    const prom = [];
    const arrPermissionCarOwner = ['createCarOwner', 'login', 'manageAccount', 'viewProduct', 'placeOrder',
        'maintainOrder', 'submitComplaint', 'chat', 'sos', 'viewStores'
    ];
    const arrPermissionGarageOwner = ['createGarageOwner', 'login', 'manageAccount', 'insertProduct',
        'viewProduct', 'updateProduct', 'deleteProduct', 'viewCategory', 'updateCategory', 'deleteCategory',
        'chat', 'manageOffers', 'viewComplaints'
    ];
    const arrPermissionAdmin = ['addUser', 'removeUser', 'viewUsers', 'viewComplaints'];

    arrPermissionCarOwner.forEach((item, index) => {
        prom.push(permissions.addPermission('carOwner', item));
    });
    arrPermissionGarageOwner.forEach((item, index) => {
        prom.push(permissions.addPermission('garageOwner', item));
    });
    arrPermissionAdmin.forEach((item, index) => {
        prom.push(permissions.addPermission('admin', item));
    });
    Promise.all(prom).then(values => {
        res.send({
            msg: 'successfully added all permissions'
        });
    }).catch(err => {
        res.status(400).send({
            Error: 'Error in autoAdding'
        });
    });
});

// app.get('/deleteallorders', (req, res) => {
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
*/
//Load Routes
const _shoppingCart = require('./src/routes/shopping-cart');
const _store = require('./src/routes/store');
const _carOwner = require('./src/routes/car-owner');
const _search = require('./src/routes/search');
const _permissions = require('./src/routes/permissions');

// Use Routes
app.use('/shopping-cart', _shoppingCart);
app.use('/store', _store);
app.use('/car-owner', _carOwner);
app.use('/search', _search);
app.use('/permissions', _permissions);

module.exports = app;