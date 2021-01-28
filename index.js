//Requiring packages
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
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



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100/");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Setting-up session and authintication
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

require('./src/models/model');

//Objects
const user = require('./src/business/Objects').USER;
const garageOwner = require('./src/business/Objects').GARAGEOWNER;
const report = require('./src/business/Objects').REPORT;

// validation by thaer
const limitAndSkipValidation = require('./src/shared/limitAndSkipValidation');

//Setting-up express app
//Setting-up path for the static files
app.use('/public', express.static('public'));
//Setting-up req body parser
app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));



//Setting-up CORS options
const corsOptions = {
    origin: 'http://localhost:8100',
    methods: "*",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// Login User 
app.get('/user/login', (req, res) => {
    res.json({
        state: 'Hello from login page'
    });
});

app.post('/user/login', (req, res, next) => {
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
                    error: 'Invalid username or password'
                });
            }

        });
    } else {
        res.send({
            msg: 'already logged in'
        });
    }
});

app.delete('/user/logout', userAuthenticated, (req, res) => {
    // console.log(req.session.token)
    // req.headers.authorization.split(' ')[0]
    req.session.token = null;
    res.send({ sucess: true })
    // res.redirect('/user/login');
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

const http = require("http")


const startTrinModelForSearchByImage = schedule.scheduleJob('0 0 1 * *', () => {
    let url = new URL("http://localhost:8000/start-training")
    http
        .request(
            url,
            res => {
               console.log('Model Was Trained')
            }
        )
        .end()
});

//--------------------Chat--------------------\\

// const server = require('http').Server(app);
// const io = require('socket.io')(server);



//Load Routes
const shoppingCartRoute = require('./src/routes/ShoppingCart');
const orderRoute = require('./src/routes/Order');
const searchRoute = require('./src/routes/Search');
const permissionsRoute = require('./src/routes/Permissions');
const carOwnerRoute = require('./src/routes/CarOwner');
const chatRoute = require('./src/routes/Chat').router;

// Use Routes
app.use(shoppingCartRoute);
app.use(orderRoute);
app.use(carOwnerRoute);
app.use(searchRoute);
app.use(permissionsRoute);
app.use(chatRoute);

carvaldation = require('./src/business/Car/validate')
app.get("/test", (req, res) => {
    let model = req.body.model;
    let make = req.body.make;
    let year = req.body.year;
    let result = carvaldation.validateCarInfo({ model, make, year });
    res.send(result);
})
module.exports = app;
