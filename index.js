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
// const login = require('./src/auth/login');
// const {
//     userAuthenticated
// } = require('./src/middleware/authentication');

//Setting-up express app
const app = express();
require('dotenv').config()



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://b2b-stg.herokuapp.com");
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
    origin: ['http://localhost:8100', 'http://localhost:8101', 'https://makt-b2b.live', 'https://b2b-stg.herokuapp.com'],
    methods: "*",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));




//Requring the scheduled jobs
//Starting the generate report services
const generatingReports = require('./src/scheduled Jobs/generatingReports');
//generatingReports.generateGarageOwnerReport();
//generatingReports.generatingAdminReport();
//Starting the clean-up expired offers service
const removeExpiredOffers = require('./src/scheduled Jobs/removingExpiredOffers');
//removeExpiredOffers.removeExpiredOffers();
//Starting the training service
const modelTrain = require('./src/scheduled Jobs/trainingModel');
//modelTrain.train();












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


//--------------------------------------Report--------------------------------------
const reportTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'b2b.report.generator@gmail.com',
        pass: 'b2bgp2020'
    }
});



const OneSignal = require('onesignal-node');
const client = new OneSignal.Client('96c26840-bc81-400a-b25c-63cba4a21b7a', 'N2U4Y2VmYmUtMmJhYS00MWI5LTk2YTQtOWI5ZDg2Zjc0MWZm');
start = async () => {
    const responseD = await client.viewDevice('edd73d40-ffa5-4994-80a2-59dc3263ee14');
    // console.log(responseD.body);

    const response = await client.viewDevices({ limit: 200, offset: 0 });
    // console.log(response.body);

    const notification = {
        contents: {
            'tr': 'Yeni bildirim',
            'en': 'New notification',
        },
        // included_segments: ['Subscribed Users'],
        include_player_ids: ['edd73d40-ffa5-4994-80a2-59dc3263ee14'],
        filters: [
            { field: 'tag', key: 'level', relation: '>', value: 10 }
        ]
    };

    // using async/await
    try {
        const response = await client.createNotification(notification);
        // console.log(response.body.id);
    } catch (e) {
        if (e instanceof OneSignal.HTTPError) {
            // When status code of HTTP response is not 2xx, HTTPError is thrown.
            // console.log(e.statusCode);
            // console.log(e.body);
        }
    }

    // or you can use promise style:
    // client.createNotification(notification)
    //     .then(response => console.log(response))
    //     .catch(e => { });

}
start()





















//----------Send garage owner report----------
// const garageOwnerReport = schedule.scheduleJob('0 0 1 * *', () => {
//     user.getAllUsersIdOfARole('garageOwner')
//         .then(garageOwners => {
//             garageOwners.forEach(garageOwnerId => {
//                 user.getUserById(garageOwnerId._id)
//                     .then(garOwner => {
//                         garageOwner.getGarageOwnerByUserId(garageOwnerId._id).then(retrivedgarageOwner => {
//                             report.getReport(retrivedgarageOwner.reportId).then(retrivedReport => {
//                                 reportForGarageOwner = `Total Income this month ${retrivedReport.totalIncome}\nNumber of delivered orders ${retrivedReport.listOfSoldItems.length}\nNumber of cancel orders ${retrivedReport.listOfCancelItems.length}`;
//                                 var mailOptions = {
//                                     from: 'b2b.report.generator@gmail.com',
//                                     to: garOwner.email,
//                                     subject: `Month:${new Date().getMonth() + 1}/${new Date().getFullYear()} Report`,
//                                     text: `Hello ${garOwner.fullName}, this is the report for the current month.\n${reportForGarageOwner}\nBest wishes, B2B team`,
//                                 };
//                                 reportTransporter.sendMail(mailOptions, function (err, info) {
//                                     if (err)
//                                         console.log({ error: "Email wasn't sent !    " + err });
//                                     else {
//                                         report.clearReport(retrivedReport._id).then(clearedReport => {
//                                             console.log({ success: 'Email sent: ' + info.response });
//                                         });
//                                     }
//                                 });
//                             });
//                         });
//                     })
//                     .catch(err => console.log({ error: "Error in generating report -Geeting garage owner by id- ! " + err }));
//             })
//         })
//         .catch(err => console.log({ error: "Error in generating report -Geting garage owners- ! " + err }));
// });
// //----------Send admin report----------
// const adminReport = schedule.scheduleJob('0 0 1 * *', () => {
//     user.getAllUsersIdOfARole('garageOwner')
//         .then(garageOwners => {
//             user.getAllUsersIdOfARole('carOwner')
//                 .then(carOwners => {
//                     user.getAllUsersIdOfARole('waitingUser')
//                         .then(waitingUsers => {
//                             reportForAdmin = `#of Garage Owners: ${garageOwners.length}\n#of Car Owners: ${carOwners.length}\n#of Waiting Users: ${waitingUsers.length}\n`;
//                             user.getAllUsersIdOfARole('admin')
//                                 .then(admins => {
//                                     admins.forEach(adminId => {
//                                         user.getUserById(adminId._id)
//                                             .then(admin => {
//                                                 var mailOptions = {
//                                                     from: 'b2b.report.generator@gmail.com',
//                                                     to: admin.email,
//                                                     subject: `Admin,Month:${new Date().getMonth() + 1}/${new Date().getFullYear()} Report`,
//                                                     text: `Hello ${admin.fullName},this is the report for the current month.\n${reportForAdmin}\nBest wishes, B2B team`,
//                                                 };
//                                                 reportTransporter.sendMail(mailOptions, function (err, info) {
//                                                     if (err)
//                                                         console.log({ error: "Email wasn't sent !    " + err });
//                                                     else
//                                                         console.log({ success: 'Email sent: ' + info.response });
//                                                 });
//                                             })
//                                             .catch(err => console.log({ error: "Error getting the admin by id. " + err }));
//                                     }); //End of for each
//                                 })
//                                 .catch(err => console.log({ error: "Error getting all the admins owners. " + err }));
//                         })
//                         .catch(err => console.log({ error: "Error getting all the waiting users. " + err }));
//                 })
//                 .catch(err => console.log({ error: "Error getting all the car owners. " + err }));
//         })
//         .catch(err => console.log({ error: "Error getting all the garage owners. " + err }));
// });




//--------------------Chat--------------------\\

// const server = require('http').Server(app);
// const io = require('socket.io')(server);

//Load Routes
const shoppingCartRoute = require('./src/routes/ShoppingCart');
const orderRoute = require('./src/routes/Order');
const searchRoute = require('./src/routes/Search');
const permissionsRoute = require('./src/routes/Permissions');
const chatRoute = require('./src/routes/Chat').router;
const loginRoute = require('./src/routes/Login');

// Use Routes
app.use(shoppingCartRoute);
app.use(orderRoute);
app.use(searchRoute);
app.use(permissionsRoute);
app.use(chatRoute);
app.use(loginRoute);

module.exports = app;
