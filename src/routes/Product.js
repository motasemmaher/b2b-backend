const express = require('express');
const router = express.Router();
const upload = require('../shared/imageUpload');
const imageToBase64 = require('image-to-base64');
const {userAuthenticated} = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');

const product = require('../business/Objects').PRODUCT;
const store = require('../business/Objects').STORE;
const warehouse = require('../business/Objects').WAREHOUSE;
const category = require('../business/Objects').CATEGORY;
const garageOwner = require('../business/Objects').GARAGEOWNER;

validateProductType =  function (productType)
{
    if(["Part","Accessory","Service"].includes(productType) || productType === "all")
        return "exists";
    else
        return "Doesn't exist";
};


//----------View products and View Product----------
router.get('/products/:productId?',(req,res) => {
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    let nameSort = parseInt(req.query.nameSort);
    let priceSort = parseInt(req.query.priceSort);
    if (nameSort == null)
        nameSort = 0;
    if (priceSort == null)
        priceSort = 0;

    let type = req.query.type;
    if(type == null)
        type = "all";
    else 
    {
        if(validateProductType(type) === "Doesn't exist")
            return res.status(400).send({error:"The requested product type is invalid !"});
    }
    
    if(req.params.productId == null)
    {
        product.getAllProducts(type,limit,skip,nameSort,priceSort)
        .then(productResults => {
        product.countAll(type)
            .then(countResult => {
            // if(productsArray.length == 0)
            //     res.status(200).send({[]})

            // productsArray = productResults;
            // productsArray.forEach((productResult,index,productsArray) => {
            //     imageToBase64(productResult.image)
            //     .then(base64Image => {
            //     productResult.image = base64Image;       
            //     if(index  === productsArray.length - 1)
                    res.status(200).send({count:countResult || 0 ,products:productResults || []});
            //     })
            //     .catch(err => {
            //         console.log({error:"Error converting image.    "+err})
            //         if (!res.headersSent)
            //         res.status(200).send({count:countResult,products:productsArray});
            //     });  
            //     }) //End of foreach
            })
            .catch((err => res.status(500).send({error:"Error getting count of all products. "+err})));
        })
        .catch(err => res.status(500).send({error:"Error getting all products. "+err}));
    }
    else
    {
        product.getProductById(req.params.productId)
            .then(productResult => {    
            if(productResult == null)
                res.status(404).send({error:"Error! Didn't find a product with that id."});
            else
            {
                // imageToBase64(productResult.image)
                // .then((base64Image) => {
                //     product.image = base64Image;
                res.status(200).send(productResult);
                // })
                // .catch(err => res.status(500).send({error:"Error converting image.    "+err}));
            }
            })
            .catch(err => res.status(500).send({error:"Error getting productby id. "+err}));
    }
 
});
//----------View products store and View Product----------
router.get('/stores/:storeId/products/:productId?',(req,res) => {
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    let nameSort = parseInt(req.query.nameSort);
    let priceSort = parseInt(req.query.priceSort);
    if (nameSort == null)
        nameSort = 0;
    if (priceSort == null)
        priceSort = 0;
    
    let type = req.query.type;
    if(type == null)
        type = "all";
    else 
    {
        if(validateProductType(type) === "Doesn't exist")
            return res.status(400).send({error:"The requested product type is invalid !"});
    } 
    
    storeId = req.params.storeId;
    store.exists(storeId)
    .then(getStoreResult => {
    if(getStoreResult == null)
        res.status(404).send({error:"Error! Didn't find a store with thats id."});
    else
    {
        if(req.params.productId == null)
        {
            product.getProductsOfStore(storeId,type,limit,skip,nameSort,priceSort)
            .then(productResults => {
            product.countByStore(storeId,type)
                .then(countResult => {
                productsArray = productResults;
                // if(productsArray.length == 0)
                //     return res.status(200).send({[]})

                // productsArray.forEach((productResult,index,productsArray) => {
                //     imageToBase64(productResult.image)
                //     .then(base64Image => {
                //     productResult.image = base64Image;       
                //     if(index  === productsArray.length - 1)
                       return res.status(200).send({productsCountByStore:countResult,products:productsArray});
                //     })
                //     .catch(err => {
                //         console.log({error:"Error converting image.    "+err})
                //         if (!res.headersSent)
                //         res.status(200).send({productsCountByStore:countResult,products:productsArray});
                //     });  
                //     }) //End of foreach
                })
                .catch((err => res.status(500).send({error:"Error getting count of products of the store. "+err})));
            })
            .catch(err => res.status(500).send({error:"Error getting products of the store. "+err}));
        }
        else
        {
            product.getProductById(req.params.productId)
                .then(productResult => {    
                if(productResult == null)
                    res.status(404).send({error:"Error! Didn't find a product with that id."});
                else
                {
                    // imageToBase64(productResult.image)
                    // .then((base64Image) => {
                    //     product.image = base64Image;
                    res.send(productResult);
                    // })
                    // .catch(err => res.status(500).send({error:"Error converting image.    "+err}));
                }
                })
                .catch(err => res.status(500).send({error:"Error getting products of the requested category. "+err}));
        }
    }
    })
    .catch(err => res.status(500).send({error:"Error getting the store. "+err}));
});
//----------View products of a category and View Product----------
router.get('/stores/:storeId/category/:categoryId/products/:productId?',(req,res) => {
    let nameSort = parseInt(req.query.nameSort);
    let priceSort = parseInt(req.query.priceSort);
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    if (nameSort == null)
        nameSort = 0;
    if (priceSort == null)
        priceSort = 0;

    let type = req.query.type;
    
    if(type == null)
        type = "all";
    else 
    {        
        if(validateProductType(type) === "Doesn't exist")
            return res.status(400).send({error:"The requested product type is invalid !"});
    }

    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    productId = req.params.productId;
    
    store.getStoreById(storeId)
    .then(getStoreResult => {
    if(getStoreResult == null)
        res.status(404).send({error:"Error! Didn't find a store with thats id."});
    else
    {
        category.findCategoryById(categoryId)
        .then(getCategoryResult => {
        if(getCategoryResult == null)
            res.status(404).send({error:"Error! Didn't find a category with that id."});
        else
        {
            if(productId == null)
            {
                //Getting the products of that category
                product.getProductsOfCategory(categoryId,type,limit,skip,nameSort,priceSort)
                .then(productsResult => {
                product.countByCategory(categoryId,type)
                    .then(countResult => {
                    // if(productsArray.length == 0)
                    //     return res.status(200).send({[]});
                    productsArray = productsResult;
                    // productsArray.forEach((productResult,index,productsArray) => {
                        // imageToBase64(productResult.image)
                        // .then(base64Image => {
                        // productResult.image = base64Image;       
                        // if(index  === productsArray.length - 1)
                            res.status(200).send({productsCountByStore:countResult,products:productsArray});
                        // })
                        // .catch(err => {
                        //     console.log({error:"Error converting image.    "+err})
                        //     if (!res.headersSent)
                        //         res.status(200).send({productsCountByStore:countResult,products:productsArray});
                        // });  
                        // }) //End of foreach
                    })
                    .catch((err => res.status(500).send({error:"Error getting count of products of the category. "+err})));
                })
                .catch(err => res.status(500).send({error:"Error getting products of the requested category. "+err}));
            }
            else
            {
                product.getProductById(productId)
                .then(productResult => {    
                if(productResult == null)
                    res.status(400).send({error:"Error! Didn't find a product with that id."});
                else
                {
                    // imageToBase64(productResult.image)
                    // .then((base64Image) => {
                    // product.image = base64Image;
                    res.status(200).send(productResult);
                    // })
                    // .catch(err => res.status(500).send({error:"Error converting image.    "+err}));
                }
                })
                .catch(err => res.status(500).send({error:"Error getting products of the requested category. "+err}));
            }
        }
        })
        .catch(err => res.status(500).send({error:"Error getting caetgory id. "+err}));
    }
    })
    .catch(err => res.status(500).send({error:"Error getting the store. "+err}));
});
//----------Create Product----------
router.post('/stores/:storeId/category/:categoryId/create-product',userAuthenticated,upload.single('image'),(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    
    if(loggedUser.role !== "garageOwner")
        res.status(401).send({error:"Unauthorized user !"});
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.status(404).send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.status(404).send({error:"Error! Didn't find a category with that id."})
            else
            {
                //Creating product
                productInfo = {...req.body,storeId:storeId,image:req.file.path,categoryId:categoryId};

                const productValidationResult = product.validateProductInfo(productInfo);
                const warehouseValidationResult = warehouse.validateWarehouseInfo({amount:req.body.amount});
                
                if(typeof productValidationResult !== 'undefined')
                    res.status(400).send({error:productValidationResult.err});
                else if(typeof warehouseValidationResult !== 'undefined')
                    res.status(400).send({error:warehouseValidationResult.err});
                else
                {
                    garageOwner.getGarageOwnerByUserId(loggedUser._id)
                    .then(garageOwnerResult => {
                        if(garageOwnerResult != null && garageOwnerResult.isTrusted)
                            productInfo = {...productInfo,tags:req.body.generalType+tags};
                        product.createProduct(productInfo)
                        .then(productResult => {
                        //Adding a ref of the product to the category
                        category.addProduct(categoryId,productResult)
                            .then(categoryResult =>{
                            //Adding the product and its quantity to the warehouse
                            warehouse.addProduct(storeId,productResult._id,categoryId,req.body.amount)
                                .then(warehouseResult => {
                                    res.status(200).send(productResult);
                                })
                                .catch(err => res.status(500).send({error:"Error updating warehouse. "+err})); 
                            })
                            .catch(err => res.status(500).send({error:"Error updating category. "+err}));
                        })
                        .catch(err => res.status(500).send({error:"Error creating product. "+err}));
                    })
                    .catch(err => res.status(500).send({error:"Error getting garageOwner by user id. "+err}));
                }            
            }
            }).catch(err => res.status(500).send({error:"Error getting category id. "+err}));
        }
        })
        .catch(err => res.status(500).send({error:"Error getting store id. "+err}));
    }
});
//----------Update Product----------
router.put('/stores/:storeId/category/:categoryId/update-product/:productId',userAuthenticated,upload.single('image'),(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    productId = req.params.productId;
    
    if(loggedUser.role !== "garageOwner")
        res.status(401).send({error:"Unauthorized user !"});
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.status(404).send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.status(404).send({error:"Error! Didn't find a category with that id."})
            else
            {
                product.exists(productId)
                .then(getProductResult => {
                if(getProductResult == null)
                    res.status(404).send({error:"Error! Didn't find a product with that id."})
                else
                {
                    productInfo = {...req.body,image:req.file.path};
                    if(req.body.amount === 0)
                        productInfo={...productInfo,isInStock:false};
                    
                    const productValidationResult = product.validateProductInfo(productInfo);
                    const warehouseValidationResult = warehouse.validateWarehouseInfo({amount:req.body.amount});
                    
                    if(typeof productValidationResult !== 'undefined')
                        res.status(400).send({error:productValidationResult.err});
                    else if(typeof warehouseValidationResult !== 'undefined')
                        res.status(400).send({error:warehouseValidationResult.err});
                    else
                    {
                        //Updating product
                        category.findCategoryByName(productInfo.categoryName)
                        .then(categoryFindByNameResult => {       
                        updatedProductInfo = {_id:productId,...productInfo,image:req.file.path,categoryId:categoryFindByNameResult._id}
                        product.updateProduct(updatedProductInfo)
                            .then(productResult =>{
                            if(categoryFindByNameResult._id != categoryId) 
                            {
                                category.removeProductFromCategory(categoryId,productId)
                                .then(removeProductFromCategoryResult => {
                                category.addProduct(updatedProductInfo.categoryId,productResult._id)
                                    .then(addProductTocategoryResult =>{
                                    warehouse.removeProductFromWarehouse(storeId,productId)
                                        .then(removeProductFromWarehouseResult => {
                                        warehouse.addProduct(storeId,productId,updatedProductInfo.categoryId,req.body.amount)
                                            .then(addProductToWarehouseResult =>{
                                            product.getProductById(productId)
                                                .then(productFindResult => {
                                                res.status(200).send(productFindResult);
                                                })
                                                .catch(err => res.status(500).send({error:"Error finding updated product.  "+err}))
                                            })
                                            .catch(err => res.status(500).send({error:"Error adding product to warehouse. "+err}));
                                        })
                                        .catch(err => res.status(500).send({error:"Error removing product from warehouse. "+err}));
                                    })
                                    .catch(err => res.status(500).send({error:"Error adding product to category. "+err}));
                                })
                                .catch(err => res.status(500).send({error:"Error removing product from category. "+err})); 
                            } 
                            //wecan get rid of this if/else
                            else
                            {
                                warehouse.removeProductFromWarehouse(storeId,productId)
                                .then(removeProductResultFromWarehouse => {
                                warehouse.addProduct(storeId,productId,categoryId,req.body.amount)
                                    .then(addProductToWarehouseResult =>{
                                    product.getProductById(productId)
                                        .then(productFindResult => {
                                        res.status(200).send(productFindResult);
                                        })
                                        .catch(err => res.status(500).send({error:"Error finding updated product.  "+err}))
                                    })
                                    .catch(err => res.status(500).send({error:"Error adding product to warehouse. "+err}));
                                })
                                .catch(err => res.status(500).send({error:"Error removing product from warehouse. "+err}));
                            }
                            })
                            .catch(err => res.status(500).send({error:"Error updating product. "+err})); 
                        })
                        .catch(err => res.status(500).send({error:"Couldn't find a category with that name. "+err}));
                    }
                }
                })
                .catch(err => res.status(500).send({error:"Error getting product by id.    "+err}));
            }
            })
            .catch(err => res.status(500).send({error:"Error getting category id. "+err}))
        }
        })
        .catch(err => res.status(500).send({error:"Error getting store id. "+err}));    
    }
});
//----------Delete Product----------
router.delete('/stores/:storeId/category/:categoryId/delete-product/:productId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    productId = req.params.productId;
    
    if(loggedUser.role !== "garageOwner")
        res.status(401).send({error:"Unauthorized user !"});
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.status(404).send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.status(404).send({error:"Error! Didn't find a category with that id."})
            else
            {
                product.exists(productId)
                .then(getProductResult => {
                if(getProductResult == null)
                    res.status(404).send({error:"Error! Didn't find a produt with that id."})
                else
                {
                    //Deleting product
                    product.deleteProduct(productId)
                    .then(deleteProductResult => {
                    //2- Updating the products list inside the category's list 
                    //Removing product ref from the category
                    category.removeProductFromCategory(categoryId,productId)
                        .then(updateCategoryResult => {
                        //Updating the warehouse
                        warehouse.removeProductFromWarehouse(storeId,productId)
                            .then(warehouseResult => {
                            res.status(200).send({success:true});
                            })
                            .catch(err => res.status(500).send({error:"Error updating warehouse. "+err}));
                        })
                        .catch(err => res.status(500).send({error:"Error updating category. "+err}));
                    })
                    .catch(err => res.status(500).send({error:"Error deleting product. "+err}));
                }
                })
                .catch(err => res.status(500).send({error:"Error getting product by id.    "+err}));
            }
            })
            .catch(err => res.status(500).send({error:"Error getting category id. "+err}))
        }
        })
        .catch(err => res.status(500).send({error:"Error getting store id. "+err}));    
    }
});

module.exports = router;