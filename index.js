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



//Requring the scheduled jobs
//Starting the generate report services
const generatingReports = require('./src/scheduled Jobs/generatingReports');
generatingReports.generateGarageOwnerReport();
generatingReports.generatingAdminReport();
//Starting the clean-up expired offers service
const removeExpiredOffers = require('./src/scheduled Jobs/removingExpiredOffers');
removeExpiredOffers.removeExpiredOffers();
//Starting the training service
const modelTrain = require('./src/scheduled Jobs/trainingModel');
modelTrain.train();












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
app.options('/view-stores/nearby'); //View nearby stores (same address)
app.options('/view-stores/location'); //View nearby stores (same location)
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






//--------------------Chat--------------------\\

// const server = require('http').Server(app);
// const io = require('socket.io')(server);



//Load Routes
const shoppingCartRoute = require('./src/routes/ShoppingCart');
const orderRoute = require('./src/routes/Order');
const searchRoute = require('./src/routes/Search');
const permissionsRoute = require('./src/routes/Permissions');
const chatRoute = require('./src/routes/Chat').router;

// Use Routes
app.use(shoppingCartRoute);
app.use(orderRoute);
app.use(searchRoute);
app.use(permissionsRoute);
app.use(chatRoute);


module.exports = app;
