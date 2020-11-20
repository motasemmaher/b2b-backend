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
const ProductModel = require("./src/models/model/Product");
*/

const SignUp = require('./src/auth/signUp');

const Category = require('./src/business/Category/Category');
const Product = require('./src/business/Product/Product');
const Warehouse = require('./src/business/Warehouse/Warehouse');
const Menu = require('./src/business/Menu/Menu');

const express = require("express");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


//----------Create garageowner----------
app.post('/user/garage-owner/create', (req, res) => {
    const user = req.body.user;
    const store = req.body.store;

    SignUp.createGarageOwner(res,user,store);
});


//----------Create Category----------
app.post('/store/:id/create-category',(req,res) => {
    //Defining needed objects
    category = new Category();
    menu = new Menu();
    //Checking if there is a category with the provided name
    const categoryPromiseResult = category.findCategoryByName(req.body.name);
    categoryPromiseResult.then(categoryFindResult =>{
        // If there aren't any categories with that name inside the store, begin the creating process
        if (categoryFindResult.length == 0 || categoryFindResult[0].storeId != req.params.id)
        {
            //1- Creating category with the provided information
            const createPromiseResult = category.createCategory({name:req.body.name,storeId:req.params.id,image:req.body.image})
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
});

//----------Update Category----------
app.put('/store/:id/update-category/:categoryId',(req,res) => {
    //Defining needed objects
    category = new Category();
    //Checking if the category exists by it's ID
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    "+err));
    //Checking if there is a category with the name that the user provided in the update information
    const categoryPromiseResultName = category.findCategoryByName(req.body.name);
    categoryPromiseResultName.then(categoryFindResult =>{
        // If there aren't any categories with that name inside the store, begin the updating process
        if (categoryFindResult.length == 0 || categoryFindResult[0].storeId != req.params.id)
        { 
            //1- Update the category with the ID with the new provided information
            category.updateCategory({_id:req.params.categoryId,name:req.body.name,image:req.body.image})
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
});

//----------Delete Category----------
app.delete('/store/:id/delete-category/:categoryId',(req,res) => {
    //Defining the needed objects
    category = new Category();
    product = new Product();
    menu = new Menu();
    warehouse = new Warehouse();
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
app.post('/store/:id/category/:categoryId/product',(req,res) => {
    //Defining needed objects
    warehouse = new Warehouse();
    category = new Category();
    product = new Product();
    //Checking if the category exists by id
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    "+err));
    //Creating product
    productInfo = {name:req.body.product.name,price:req.body.product.price,image:req.body.product.image,categoryId:req.params.categoryId,productType:req.body.product.productType,description:req.body.product.description};
    product.createProduct(productInfo)
            .then(productResult => {
            //Adding a ref of the product to the category
            category.addProduct(req.params.categoryId,productResult)
                .then(categoryResult =>{
                //Adding the product and its quantity to the warehouse
                warehouse.addProduct(req.params.id,productResult._id,req.params.categoryId,req.body.warehouse.amount)
                    .then(warehouseResult => {
                    res.send(productResult);
                    })
                    .catch(err => {
                    res.send({error:"Error updating warehouse. "+err})
                    });
                })
                .catch(err => {
                res.send({error:"Error updating category. "+err})
            })
            .catch(err => {
            res.send({error:"Error creating product. "+err})
        });
    });
});

//----------Update Product----------
app.put('/store/:id/category/:categoryId/product/:productId',(req,res) => {
    //Defininfg needed objects
    warehouse = new Warehouse();
    category = new Category();
    product = new Product();
    //Updating product
    
});

//----------Delete Product----------
app.delete('/store/:id/category/:categoryId/product/:productId',(req,res) => {
    //Defininfg needed objects
    warehouse = new Warehouse();
    category = new Category();
    product = new Product();
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





//----------View Categories of a store----------
app.get('/store/:id/categories',(req,res) => {
    //Defining needed objects
    menu = new Menu();
    //Getting the categories list from that menu
    menu.getAllCategories(req.params.id).populate("categories")
        .then(categoriesResult => {console.log(categoriesResult); res.send(categoriesResult)})
        .catch(err => res.send({error:"Error getting categories of the requested store. "+err}));
});

//----------View products of a category----------
app.get('/store/:id/category/:categoryId/products',(req,res) => {
    //Defining needed objects
    category = new Category();
    //Checking if the category exists by it's ID
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    "+err));
    //Getting the products of that category
    category.getProductsOfCategory(req.params.categoryId)
        .then(productsResult => res.send(productsResult))
        .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
});

//----------View a product----------
app.get('/store/:id/category/:categoryId/products/productId',(req,res) => {
    product = new Product();
    
    category = new Category();
    const categoryPromiseResultId = category.findCategoryById(req.params.categoryId);
    categoryPromiseResultId.then().catch(err => res.send("Error getting category id.    "+err));

    product.getAllProducts(req.body.categoryId)
        .then(productsResult => res.send(productsResult))
        .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
});

//----------View a caregory----------
app.get('/store/:id/category/:categoryId',(req,res) => {
    category = new category();
    category.findCategoryById(req.params.categoryId)
        .then(categoryResult => res.send(categoryResult))
        .catch(err => {error:"Error getting the requested category. "+err});
});





module.exports = app;




app.post('/user/garage-owner/create', (req, res) => {
    const user = req.body.user;
    const store = req.body.store;

    SignUp.createGarageOwner(res,user,store);
});

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
