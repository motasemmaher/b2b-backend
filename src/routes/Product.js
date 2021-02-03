//Requiring the necessay files, middlewares and packages
const express = require('express');
const router = express.Router();
const upload = require('../shared/imageUpload');
const imageToBase64 = require('image-to-base64');
const uploadImage = require('../shared/uploadImage');
const randomId = require('../shared/generateRandomId');
const { userAuthenticated } = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');
const axios = require('axios')
//Requiring the necessary objects
const product = require('../business/Objects').PRODUCT;
const store = require('../business/Objects').STORE;
const warehouse = require('../business/Objects').WAREHOUSE;
const category = require('../business/Objects').CATEGORY;
const garageOwner = require('../business/Objects').GARAGEOWNER;
//A method to validate the input type
validateProductType = function (productType) {
    if (["Part", "Accessory", "Service"].includes(productType) || productType === "all")
        return "exists";
    else
        return "Doesn't exist";
};

//----------View products and View Product----------
router.get('/products/:productId?', (req, res) => {
    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //Checking the name and price sort values
    let nameSort = parseInt(req.query.nameSort);
    let priceSort = parseInt(req.query.priceSort);
    if (nameSort == null)
        nameSort = 0;
    if (priceSort == null)
        priceSort = 0;
    //Checking the type value
    let type = req.query.type;
    if (type == null)
        type = "all";
    else {
        if (validateProductType(type) === "Doesn't exist")
            return res.status(400).send({ error: "The requested product type is invalid !" });
    }
    //If the product id wasn't provided in the url, then return all the products stored in the database of the specified type
    if (req.params.productId == null) {
        //Getting all the products from the specified type
        product.getAllProducts(type, limit, skip, nameSort, priceSort)
            .then(productResults => {
                //Getting the count all the products from the specified type
                product.countAll(type)
                    .then(countResult => {
                        // if(productsArray.length == 0)
                        //     return res.status(200).send({count:0,products:[]})

                        // productsArray = productResults;
                        // productsArray.forEach((productResult,index,productsArray) => {
                        //     imageToBase64(productResult.image)
                        //     .then(base64Image => {
                        //     productResult.image = base64Image;       
                        //     if(index  === productsArray.length - 1)
                        //Returning a successful response
                        return res.status(200).send({ count: countResult || 0, products: productResults || [] });
                        //     })
                        //     .catch(err => {
                        //         console.log({error:"Error converting image.    "+err})
                        //         if (!return res.headersSent)
                        //         return res.status(200).send({count:countResult,products:productsArray});
                        //     });  
                        //     }) //End of foreach
                    })
                    //If getting the count runs into error, then return an error response
                    .catch(err => { return res.status(500).send({ error: "Error getting count of all products. " + err }) });
            })
            //If getting the products runs into error, then return an error response
            .catch(err => { return res.status(500).send({ error: "Error getting all products. " + err }) });
    }
    //If the productId was provied, then get that product
    else {
        //Gettign the product
        product.getProductById(req.params.productId)
            .then(productResult => {
                //If the product doesn't exist, then return an error response
                if (productResult == null)
                    return res.status(404).send({ error: "Error! Didn't find a product with that id." });
                //If the product exists, then return a successful response
                else {
                    //imageToBase64(productResult.image)
                    //.then((base64Image) => {
                    //product.image = base64Image;
                    return res.status(200).send(productResult);
                    // })
                    // .catch(err => {return res.status(500).send({error:"Error converting image.    "+err})});
                }
            })
            //If getting the product runs into error, then return an error response
            .catch(err => { return res.status(500).send({ error: "Error getting productby id. " + err }) });
    }
});
//----------View products store and View Product----------
router.get('/stores/:storeId/products/:productId?', (req, res) => {
    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //Checking the name and price sort values
    let nameSort = parseInt(req.query.nameSort);
    let priceSort = parseInt(req.query.priceSort);
    if (nameSort == null)
        nameSort = 0;
    if (priceSort == null)
        priceSort = 0;
    //Checking the type value
    let type = req.query.type;
    if (type == null)
        type = "all";
    else {
        if (validateProductType(type) === "Doesn't exist")
            return res.status(400).send({ error: "The requested product type is invalid !" });
    }
    //Checking if the storeId exists
    storeId = req.params.storeId;
    store.exists(storeId)
        .then(getStoreResult => {
            //If it doesn't exists, then return an error response
            if (!getStoreResult)
                return res.status(404).send({ error: "Error! Didn't find a store with thats id." });
            else {
                //Checking if the productId was provided in the url
                //If it wasn't provided then return all the products from that store within the specified type
                if (req.params.productId == null) {
                    //Getting the products of the store of the specified type
                    product.getProductsOfStore(storeId, type, limit, skip, nameSort, priceSort)
                        .then(productResults => {
                            //Getting the count of products of the store of the specified type
                            product.countByStore(storeId, type)
                                .then(countResult => {
                                    productsArray = productResults;
                                    // if(productsArray.length == 0)
                                    //     return res.status(200).send({count:0,products:[]})

                                    // productsArray.forEach((productResult,index,productsArray) => {
                                    //     imageToBase64(productResult.image)
                                    //     .then(base64Image => {
                                    //     productResult.image = base64Image;       
                                    //     if(index  === productsArray.length - 1)
                                    //Returing a successful response
                                    return res.status(200).send({ productsCountByStore: countResult, products: productsArray });
                                    //     })
                                    //     .catch(err => {
                                    //         console.log({error:"Error converting image.    "+err})
                                    //         if (!res.headersSent)
                                    //         return res.status(200).send({productsCountByStore:countResult,products:productsArray});
                                    //     });  
                                    //     }) //End of foreach
                                })
                                //If getting the count runs into error, then return an error response
                                .catch(err => { return res.status(500).send({ error: "Error getting count of products of the store. " + err }) });
                        })
                        //If getting the products runs into error, then return an error response
                        .catch(err => { return res.status(500).send({ error: "Error getting products of the store. " + err }) });
                }
                //If the productId wasprovided in the url, then retur the product
                else {
                    //Getting the product
                    product.getProductById(req.params.productId)
                        .then(productResult => {
                            //If it doesn't exists, then return an error response
                            if (productResult == null)
                                return res.status(404).send({ error: "Error! Didn't find a product with that id." });
                            else {
                                // imageToBase64(productResult.image)
                                // .then((base64Image) => {
                                //     product.image = base64Image;
                                //Return a successful response
                                return res.send(productResult);
                                // })
                                // .catch(err => {return res.status(500).send({error:"Error converting image.    "+err})});
                            }
                        })
                        //If getting the product runs into error, then return an error response.
                        .catch(err => { return res.status(500).send({ error: "Error getting products of the requested category. " + err }) });
                }
            }
        })
        //If getting the store runs into error, then return an error response.
        .catch(err => { return res.status(500).send({ error: "Error getting the store. " + err }) });
});
//----------View products of a category and View Product----------
router.get('/stores/:storeId/category/:categoryId/products/:productId?', (req, res) => {

    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //Checking the name and price sort values
    let nameSort = parseInt(req.query.nameSort);
    let priceSort = parseInt(req.query.priceSort);
    if (nameSort == null)
        nameSort = 0;
    if (priceSort == null)
        priceSort = 0;
    //Checking the type value
    let type = req.query.type;
    if (type == null)
        type = "all";
    else {
        if (validateProductType(type) === "Doesn't exist")
            return res.status(400).send({ error: "The requested product type is invalid !" });
    }

    productId = req.params.productId;
    //Checking if the storeId exists
    storeId = req.params.storeId;
    store.exists(storeId)
        .then(getStoreResult => {
            //If it doesn't ecxst, then return an error response
            if (!getStoreResult)
                return res.status(404).send({ error: "Error! Didn't find a store with thats id." });
            else {
                //Checking if the categoryId exists
                categoryId = req.params.categoryId;
                category.exists(categoryId)
                    .then(getCategoryResult => {
                        if (!getCategoryResult)
                            return res.status(404).send({ error: "Error! Didn't find a category with that id." });
                        else {
                            if (productId == null) {
                                //Getting the products of that category
                                product.getProductsOfCategory(categoryId, type, limit, skip, nameSort, priceSort)
                                    .then(productsResult => {
                                        //Getting the count products of that category
                                        product.countByCategory(categoryId, type)
                                            .then(countResult => {
                                                // if(productsArray.length == 0)
                                                //     return res.status(200).send({count:0,products:[]});
                                                productsArray = productsResult;
                                                // productsArray.forEach((productResult,index,productsArray) => {
                                                // imageToBase64(productResult.image)
                                                // .then(base64Image => {
                                                // productResult.image = base64Image;       
                                                // if(index  === productsArray.length - 1)
                                                //Returning a successful response
                                                return res.status(200).send({ productsCountByStore: countResult, products: productsArray });
                                                // })
                                                // .catch(err => {
                                                //     console.log({error:"Error converting image.    "+err})
                                                //     if (!res.headersSent)
                                                //         return res.status(200).send({productsCountByStore:countResult,products:productsArray});
                                                // });  
                                                // }) //End of foreach
                                            })
                                            //If getting the count of products of a category runs into error, then return an error response
                                            .catch(err => { return res.status(500).send({ error: "Error getting count of products of the category. " + err }) });
                                    })
                                    //If getting the products of a category runs into error, then return an error response
                                    .catch(err => { return res.status(500).send({ error: "Error getting products of the requested category. " + err }) });
                            }
                            //If teh productId was provided, then get the product
                            else {
                                product.getProductById(productId)
                                    .then(productResult => {
                                        //If the product doesn't exist, then return an error response
                                        if (productResult == null)
                                            return res.status(400).send({ error: "Error! Didn't find a product with that id." });
                                        else {
                                            // imageToBase64(productResult.image)
                                            // .then((base64Image) => {
                                            // product.image = base64Image;
                                            //Return a successful response
                                            return res.status(200).send(productResult);
                                            // })
                                            // .catch(err => {return res.status(500).send({error:"Error converting image.    "+err})});
                                        }
                                    })
                                    //If getting the productruns into error, then return an error response
                                    .catch(err => { return res.status(500).send({ error: "Error getting products of the requested category. " + err }) });
                            }
                        }
                    })
                    //If getting the category runs into error, then return an error response
                    .catch(err => { return res.status(500).send({ error: "Error getting caetgory id. " + err }) });
            }
        })
        //If getting the store runs into error, then return an error response
        .catch(err => { return res.status(500).send({ error: "Error getting the store. " + err }) });
});
//----------Create Product----------
router.post('/stores/:storeId/category/:categoryId/create-product', userAuthenticated, (req, res) => { //  upload.single('image'), 
    //Getting and checking if the logged user is an authorized one, if not then return error response
    loggedUser = req.user;
    if (loggedUser.role !== "garageOwner")
        return res.status(401).send({ error: "Unauthorized user !" });
    //Checking if the request body id empty or not, if it is then return error response
    if (Object.keys(req.body).length === 0)
        return res.status(400).send({ error: "No data was sent!" });
    else {
        //Checking if the store exists
        storeId = req.params.storeId;
        store.exists(storeId)
            .then(getStoreResult => {
                //If it doesn't exist, return an error response
                if (!getStoreResult)
                    return res.status(404).send({ error: "Error! Didn't find a store with that id." });
                //If it doesn't belong to the current logged user, return an error response
                else if (getStoreResult.userId != loggedUser._id)
                    return res.status(401).send({ error: "Error! The requested store doesn't belong to this garage owner." });
                else {
                    //Checking if the category exists by it's ID
                    categoryId = req.params.categoryId;
                    category.exists(categoryId)
                        .then(getCategoryResult => {
                            //If it doesn't exist, return an error response
                            if (!getCategoryResult)
                                return res.status(404).send({ error: "Error! Didn't find a category with that id." })
                            else {
                                //Creating product
                                //Storing and validating the data from the request body
                                productInfo = { ...req.body, storeId: storeId, categoryId: categoryId }; // image: req.file.path,

                                const productValidationResult = product.validateProductInfo(productInfo);
                                const warehouseValidationResult = warehouse.validateWarehouseInfo({ amount: req.body.amount });

                                //If the validation result have errors, then return an error response
                                if (typeof productValidationResult !== 'undefined')
                                    return res.status(400).send({ error: productValidationResult.error });
                                else if (typeof warehouseValidationResult !== 'undefined')
                                    return res.status(400).send({ error: warehouseValidationResult.error });
                                //If no errors were found, then proceed
                                else {

                                    //Generating random id as an imagename
                                    const randomIdValue = randomId.generateId();
                                    const path = `public/images/${randomIdValue}.png`;
                                    //Getting the garaqgeOwner
                                    garageOwner.getGarageOwnerByUserId(loggedUser._id)
                                        .then(garageOwnerResult => {

                                            if (garageOwnerResult == null)
                                                return res.status(400).send({ error: "Didn't find a garageOwner with that userId !" });


                                            //If the garageOwner is a trusted one, then save and train the image processing model
                                            tags = req.body.generalType + "," + productInfo.tags;
                                            console.log(productInfo)
                                            productInfo = { ...productInfo, tags: tags, image: path };

                                            if (garageOwnerResult.isTrusted) {
                                                //TRAINING CALL
                                                axios
                                                    .post(`http://localhost:8000/add-image/${req.body.generalType}/${randomIdValue}`, {
                                                        img: req.body.image
                                                    })
                                                    .then(res => {
                                                        console.log(`statusCode: ${res.statusCode}`)
                                                        console.log(res)
                                                    })
                                                    .catch(error => {
                                                        console.error(error)
                                                    })

                                            }
                                            //Creating the product
                                            product.createProduct(productInfo)
                                                .then(productResult => {
                                                    //Adding a ref of the product to the category
                                                    category.addProduct(categoryId, productResult)
                                                        .then(categoryResult => {
                                                            //Adding the product and its quantity to the warehouse
                                                            warehouse.addProduct(storeId, productResult._id, categoryId, req.body.amount)
                                                                .then(warehouseResult => {
                                                                    //Uploading image to the server                                                                    
                                                                    uploadImage.upload(path, req.body.image);
                                                                    //Returning a successful response
                                                                    return res.status(200).send(productResult);
                                                                })
                                                                //If updating warehouse runs into error, then return an error response
                                                                .catch(err => { return res.status(500).send({ error: "Error updating warehouse. " + err }) });
                                                        })
                                                        //If updating category runs into error, then return an error response
                                                        .catch(err => { return res.status(500).send({ error: "Error updating category. " + err }) });
                                                })
                                                //If creating product runs into error, then return an error response
                                                .catch(err => { return res.status(500).send({ error: "Error creating product. " + err }) });
                                        })
                                        //If gettign garageOwner runs into error, then return an error response
                                        .catch(err => { return res.status(500).send({ error: "Error getting garageOwner by user id. " + err }) });
                                }
                            }
                        })
                        //If getting category runs into error, then return an error response
                        .catch(err => { return res.status(500).send({ error: "Error getting category id. " + err }) });
                }
            })
            //If getting store runs into error, then return an error response
            .catch(err => { return res.status(500).send({ error: "Error getting store id. " + err }) });
    }
});
//----------Update Product----------
router.put('/stores/:storeId/category/:categoryId/update-product/:productId', userAuthenticated, (req, res) => { //  upload.single('image'),
    //Getting and checking if the logged user is an authorized one, if not then return error response
    loggedUser = req.user;
    if (loggedUser.role !== "garageOwner")
        return res.status(401).send({ error: "Unauthorized user !" });
    //Checking if the request body id empty or not, if it is then return error response
    if (Object.keys(req.body).length === 0)
        return res.status(400).send({ error: "No data was sent!" });
    else {
        //Checking if the store exists
        storeId = req.params.storeId;
        store.exists(storeId)
            .then(getStoreResult => {
                //If it doesn't exist, then return an error response
                if (!getStoreResult)
                    return res.status(404).send({ error: "Error! Didn't find a store with that id." });
                //If it doesn't belong to the loggedUser, then return an error response
                else if (getStoreResult.userId != loggedUser._id)
                    return res.status(401).send({ error: "Error! The requested store doesn't belong to this garage owner." });
                else {
                    //Checking if the category exists by it's ID
                    categoryId = req.params.categoryId;
                    category.exists(categoryId)
                        .then(getCategoryResult => {
                            //If it doesn't exist, then return an error response
                            if (!getCategoryResult)
                                return res.status(404).send({ error: "Error! Didn't find a category with that id." })
                            else {
                                //Checking if the product exists
                                productId = req.params.productId;
                                product.exists(productId)
                                    .then(getProductResult => {
                                        //If it doesn't exist, then return an error response
                                        if (!getProductResult)
                                            return res.status(404).send({ error: "Error! Didn't find a product with that id." })
                                        else {
                                            //Generating random id as an imagename
                                            const randomIdValue = randomId.generateId();
                                            const path = `public/images/${randomIdValue}.png`;
                                            //Storing the data from the request body then validating them
                                            productInfo = { ...req.body }; //  image: req.file.path
                                            //If the amount =0, then change the stock status of the product to false
                                            if (req.body.amount === 0)
                                                productInfo = { ...productInfo, isInStock: false };
                                            const productValidationResult = product.validateProductInfo(productInfo);
                                            const warehouseValidationResult = warehouse.validateWarehouseInfo({ amount: req.body.amount });
                                            //If errors were found, then return an error response
                                            if (typeof productValidationResult !== 'undefined')
                                                return res.status(400).send({ error: productValidationResult.error });
                                            else if (typeof warehouseValidationResult !== 'undefined')
                                                return res.status(400).send({ error: warehouseValidationResult.error });
                                            //If no errors were found, then procedd to updating the product
                                            else {
                                                //Updating product
                                                category.findCategoryById(categoryId)
                                                    .then(categoryFindByNameResult => {
                                                        tags = req.body.generalType + "," + updatedProductInfo.tags;
                                                        updatedProductInfo = { _id: productId, ...productInfo, categoryId: categoryFindByNameResult._id, tags: tags, image: path } // , image: req.file.path,
                                                        //If the garageOwner is trusted, then save and train the image processing nmodel
                                                        if (garageOwnerResult.isTrusted) {
                                                            //Training call   
                                                            //TRAINING CALL
                                                            axios
                                                                .post(`http://localhost:8000/add-image/${req.body.generalType}/${randomIdValue}`, {
                                                                    img: req.body.image
                                                                })
                                                                .then(res => {
                                                                    console.log(`statusCode: ${res.statusCode}`)
                                                                    console.log(res)
                                                                })
                                                                .catch(error => {
                                                                    console.error(error)
                                                                })
                                                        }
                                                        //Updating the product
                                                        product.updateProduct(updatedProductInfo)
                                                            .then(productResult => {
                                                                if (categoryFindByNameResult._id != categoryId) {
                                                                    //Updating the product int the category
                                                                    category.removeProductFromCategory(categoryId, productId)
                                                                        .then(removeProductFromCategoryResult => {
                                                                            category.addProduct(updatedProductInfo.categoryId, productResult._id)
                                                                                .then(addProductTocategoryResult => {
                                                                                    //Update the product in the warehouse
                                                                                    warehouse.removeProductFromWarehouse(storeId, productId)
                                                                                        .then(removeProductFromWarehouseResult => {
                                                                                            warehouse.addProduct(storeId, productId, updatedProductInfo.categoryId, req.body.amount)
                                                                                                .then(addProductToWarehouseResult => {
                                                                                                    //Getting the product
                                                                                                    product.getProductById(productId)
                                                                                                        .then(productFindResult => {
                                                                                                            //Uploading the image
                                                                                                            uploadImage.upload(path, req.body.image)
                                                                                                            //Returning a successful response
                                                                                                            return res.status(200).send(productFindResult);
                                                                                                        })
                                                                                                        //If getting product runs into error, then return an error response
                                                                                                        .catch(err => { return res.status(500).send({ error: "Error finding updated product.  " + err }) });
                                                                                                })
                                                                                                //If adding product to warehouse runs into error, then return an error response
                                                                                                .catch(err => { return res.status(500).send({ error: "Error adding product to warehouse. " + err }) });
                                                                                        })
                                                                                        //If removing product from warehouse runs into error, then return an error response
                                                                                        .catch(err => { return res.status(500).send({ error: "Error removing product from warehouse. " + err }) });
                                                                                })
                                                                                //If adding product to category runs into error, then return an error response
                                                                                .catch(err => { return res.status(500).send({ error: "Error adding product to category. " + err }) });
                                                                        })
                                                                        //If removing product from category runs into error, then return an error response
                                                                        .catch(err => { return res.status(500).send({ error: "Error removing product from category. " + err }) });
                                                                }
                                                                //we can get rid of this if/else
                                                                else {
                                                                    warehouse.removeProductFromWarehouse(storeId, productId)
                                                                        .then(removeProductResultFromWarehouse => {
                                                                            warehouse.addProduct(storeId, productId, categoryId, req.body.amount)
                                                                                .then(addProductToWarehouseResult => {
                                                                                    product.getProductById(productId)
                                                                                        .then(productFindResult => {
                                                                                            //Uploading the image
                                                                                            uploadImage.upload(path, req.body.image)
                                                                                            //Returning a successful response
                                                                                            return res.status(200).send(productFindResult);
                                                                                        })
                                                                                        //If getting product runs into error, then return an error response
                                                                                        .catch(err => { return res.status(500).send({ error: "Error finding updated product.  " + err }) })
                                                                                })
                                                                                //If adding product to warehouse runs into error, then return an error response
                                                                                .catch(err => { return res.status(500).send({ error: "Error adding product to warehouse. " + err }) });
                                                                        })
                                                                        //If removing product from warehouse runs into error, then return an error response
                                                                        .catch(err => { return res.status(500).send({ error: "Error removing product from warehouse. " + err }) });
                                                                }
                                                            })
                                                            //If updating product into error, then return an error response
                                                            .catch(err => { return res.status(500).send({ error: "Error updating product. " + err }) });
                                                    })
                                                    //If getting category runs into error, then return an error response
                                                    .catch(err => { return res.status(500).send({ error: "Couldn't find a category with that name. " + err }) });
                                            }
                                        }
                                    })
                                    //If getting product runs into error, then return an error response
                                    .catch(err => { return res.status(500).send({ error: "Error getting product by id.    " + err }) });
                            }
                        })
                        //If getting category runs into error, then return an error response
                        .catch(err => { return res.status(500).send({ error: "Error getting category id. " + err }) })
                }
            })
            //If getting store runs into error, then return an error response
            .catch(err => { return res.status(500).send({ error: "Error getting store id. " + err }) });
    }
});
//----------Delete Product----------
router.delete('/stores/:storeId/category/:categoryId/delete-product/:productId', userAuthenticated, (req, res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response
    loggedUser = req.user;
    if (loggedUser.role !== "garageOwner")
        return res.status(401).send({ error: "Unauthorized user !" });
    else {
        //Checking if the store exists
        storeId = req.params.storeId;
        store.exists(storeId)
            .then(getStoreResult => {
                //If it doesn't exist, then return an error response
                if (!getStoreResult)
                    return res.status(404).send({ error: "Error! Didn't find a store with that id." });
                //If it doesn't belong to the current loggedUser, then return an error response
                else if (getStoreResult.userId != loggedUser._id)
                    return res.status(401).send({ error: "Error! The requested store doesn't belong to this garage owner." });
                else {
                    //Checking if the category exists
                    categoryId = req.params.categoryId;
                    category.exists(categoryId)
                        .then(getCategoryResult => {
                            //If it doesn't exist, then return an error response
                            if (!getCategoryResult)
                                return res.status(404).send({ error: "Error! Didn't find a category with that id." })
                            else {
                                //Checking if the product exists
                                productId = req.params.productId;
                                product.exists(productId)
                                    .then(getProductResult => {
                                        //If it doesn't exist, then return an error response
                                        if (!getProductResult)
                                            return res.status(404).send({ error: "Error! Didn't find a produt with that id." })
                                        else {
                                            //Deleting product
                                            product.deleteProduct(productId)
                                                .then(deleteProductResult => {
                                                    //Removing product ref from the category
                                                    category.removeProductFromCategory(categoryId, productId)
                                                        .then(updateCategoryResult => {
                                                            //removing product from the warehouse
                                                            warehouse.removeProductFromWarehouse(storeId, productId)
                                                                .then(warehouseResult => {
                                                                    //Returning a successful response
                                                                    return res.status(200).send({ success: true });
                                                                })
                                                                //If updating warehouse runs into error, then return an error response
                                                                .catch(err => { return res.status(500).send({ error: "Error updating warehouse. " + err }) });
                                                        })
                                                        //If updating category runs into error, then return an error response
                                                        .catch(err => { return res.status(500).send({ error: "Error updating category. " + err }) });
                                                })
                                                //If deleting product runs into error, then return an error response
                                                .catch(err => { return res.status(500).send({ error: "Error deleting product. " + err }) });
                                        }
                                    })
                                    //If getting product runs into error, then return an error response
                                    .catch(err => { return res.status(500).send({ error: "Error getting product by id.    " + err }) });
                            }
                        })
                        //If getting category runs into error, then return an error response
                        .catch(err => { return res.status(500).send({ error: "Error getting category id. " + err }) });
                }
            })
            //If getting store runs into error, then return an error response
            .catch(err => { return res.status(500).send({ error: "Error getting store id. " + err }) });
    }
});
//Exporting the route
module.exports = router;