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

//Objects
const product = require('./src/business/Objects').PRODUCT;
const user = require('./src/business/Objects').USER;
const garageOwner = require('./src/business/Objects').GARAGEOWNER;
const contact = require('./src/business/Objects').CONTACT;
// const Chat = require('./src/business/Objects');
const report = require('./src/business/Objects').REPORT;

// validation by thaer
const limitAndSkipValidation = require('./src/shared/limitAndSkipValidation');

//Setting-up express app
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

// Login User 
app.get('/user/login', (req, res) => {
    res.json({
        state: 'Hello from login page'
    });
});

app.post('/user/login', (req, res, next) => {
    // console.log(req.body.username, req.body.password);
    // The HTTP 429 Too Many Requests response status code indicates the user has sent too many 
    // requests in a given amount of time ("rate limiting").        
    // A Retry-After header might be included to this 
    //response indicating how long to wait before making a new request.
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
});

app.delete('/user/logout', (req, res) => {
    req.session.token = null;
    res.redirect('/user/login');
});



//log-in & log-out CORS
app.options('*');
// app.options('/user/logout');



//Sign-up CORS
app.options('/auth/garage-owner/create'); //Creating garageOwner
app.options('/auth/car-owner/create'); //Creating carOwner

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
        contact.updateContact({
            ownerId: garageOwnerId,
            name: req.body.userName,
            otherUserId: userInfo._id
        }).then(retrivedGarageOwnerContact => {
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
    

//Load Routes
const shoppingCartRoute = require('./src/routes/ShoppingCart');
const orderRoute = require('./src/routes/Order');
const searchRoute = require('./src/routes/Search');
const permissionsRoute = require('./src/routes/Permissions');

// Use Routes
app.use(shoppingCartRoute);
app.use(orderRoute);
app.use(searchRoute);
app.use(permissionsRoute);

module.exports = app;