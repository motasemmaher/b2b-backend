const MessageModel = require("./src/models/model/Message");
const CategoryModel = require("./src/models/model/Category");
const ProductModel = require("./src/models/model/Product");
const OfferModel = require("./src/models/model/Offer");
const MenuModel = require("./src/models/model/Menu");
const WarehouseModel = require("./src/models/model/Warehouse");
const ComplaintModel = require("./src/models/model/Complaint");
const UserModel = require('./src/models/model/User');
const GarageOwnerModel = require('./src/models/model/GarageOwner');
const CarOwnerModel = require('./src/models/model/CarOwner');
const StoreModel = require('./src/models/model/Store');
const CarModel = require('./src/models/model/Car');
const CartItemModel = require('./src/models/model/CartItem');
const ShoppingCartModel = require('./src/models/model/ShoppingCart');
const OrderModel = require('./src/models/model/Order');

const SignUp = require('./src/auth/signUp');
const login = require('./src/auth/login');
const {
    userAuthenticated
} = require('./src/middleware/authentication');
const express = require("express");
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const CarOwner = require("./src/models/model/CarOwner");
const CartItem = require("./src/models/schema/CartItem");



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

app.post('/order', (req, res) => {
    
});

app.post('/create-product', (req, res) => {
    WarehouseModel.getWarehouse({
        _id: req.body.warehouseId
    }).then((warehouse) => {
        ProductModel.createProduct({
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            categoryId: req.body.categoryId,
            productType: req.body.productType,
            description: req.body.description
        }).then((product) => {
            warehouse.storage.push({
                productId: product,
                amount: req.body.amount
            });
            warehouse.save().then(savedProduct => {
                res.json("product is saved");
            });
        });

    });
});

app.post('/create-category', (req, res) => {
    CategoryModel.createCategory({
        name: req.body.name,
        image: req.body.image,
        storeId: req.body.storeId
    });
    res.json("category is saved");
});

module.exports = app;




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