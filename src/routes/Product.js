const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const upload = require('../shared/imageUpload');
const {userAuthenticated} = require('../middleware/authentication');
const limitAndSkipValidation = require('./src/validations/limitAndSkipValidation');
//Setting-up path for the static files
router.use('./public', express.static('uploads'));
//Setting-up req body parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

const Product = require('../business/Product/Product');
const product = new Product();

//----------View products and View Product----------
router.get('/products/:productId?',(req,res) => {
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
    
    if(req.params.productId == null)
    {
        product.getAllProducts(limit,skip,nameSort,priceSort)
        .then(productResults => {
        product.countAll()
            .then(countResult => {
            productsArray = productResults;
            productsArray.forEach((productResult,index,productsArray) => {
                imageToBase64(productResult.image)
                .then(base64Image => {
                productResult.image = base64Image;       
                if(index  === productsArray.length - 1)
                    res.send({count:countResult,products:productsArray});
                })
                .catch(err => {
                    console.log({error:"Error converting image.    "+err})
                    if (!res.headersSent)
                    res.send({count:countResult,products:productsArray});
                });  
                }) //End of foreach
            })
            .catch((err => res.send({error:"Error getting count of all products. "+err})));
        })
        .catch(err => res.send({error:"Error getting all products. "+err}));
    }
    else
    {
        product.getProductById(req.params.productId)
            .then(productResult => {    
            if(productResult == null)
                res.send({error:"Error! Didn't find a product with that id."});
            else
            {
                imageToBase64(productResult.image)
                .then((base64Image) => {
                    product.image = base64Image;
                res.send(productResult);
                })
                .catch(err => res.send({error:"Error converting image.    "+err}));
            }
            })
            .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
    }
 
});
//----------View products store and View Product----------
router.get('/stores/:storeId/products/:productId?',(req,res) => {
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
    
    storeId = req.params.storeId;
    store.exists(storeId)
    .then(getStoreResult => {

    if(getStoreResult == null)
        res.send({error:"Error! Didn't find a store with thats id."});
    else
    {
        if(req.params.productId == null)
        {
            product.getProductsOfStore(storeId,limit,skip,nameSort,priceSort)
            .then(productResults => {
            product.countByStore(storeId)
                .then(countResult => {
                productsArray = productResults;
                productsArray.forEach((productResult,index,productsArray) => {
                    imageToBase64(productResult.image)
                    .then(base64Image => {
                    productResult.image = base64Image;       
                    if(index  === productsArray.length - 1)
                        res.send({productsCountByStore:countResult,products:productsArray});
                    })
                    .catch(err => {
                        console.log({error:"Error converting image.    "+err})
                        if (!res.headersSent)
                        res.send({productsCountByStore:countResult,products:productsArray});
                    });  
                    }) //End of foreach
                })
                .catch((err => res.send({error:"Error getting count of products of the store. "+err})));
            })
            .catch(err => res.send({error:"Error getting products of the store. "+err}));
        }
        else
        {
            product.getProductById(req.params.productId)
                .then(productResult => {    
                if(productResult == null)
                    res.send({error:"Error! Didn't find a product with that id."});
                else
                {
                    imageToBase64(productResult.image)
                    .then((base64Image) => {
                        product.image = base64Image;
                    res.send(productResult);
                    })
                    .catch(err => res.send({error:"Error converting image.    "+err}));
                }
                })
                .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
        }
    }
    })
    .catch(err => res.send({error:"Error getting the store. "+err}));
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

    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    productId = req.params.productId;
    
    store.getStoreById(storeId)
    .then(getStoreResult => {
    if(getStoreResult == null)
        res.send({error:"Error! Didn't find a store with thats id."});
    else
    {
        category.findCategoryById(categoryId)
        .then(getCategoryResult => {
        if(getCategoryResult == null)
            res.send({error:"Error! Didn't find a category with that id."});
        else
        {
            if(productId == null)
            {
                //Getting the products of that category
                category.getProductsOfCategory(categoryId,limit,skip,nameSort,priceSort)
                .then(productsResult => {
                productsArray = productsResult;
                productsArray.forEach((productResult,index,productsArray) => {
                    imageToBase64(productResult.image)
                    .then(base64Image => {
                    productResult.image = base64Image;       
                    if(index  === productsArray.length - 1)
                        res.send({productsCountByStore:countResult,products:productsArray});
                    })
                    .catch(err => {
                        console.log({error:"Error converting image.    "+err})
                        if (!res.headersSent)
                        res.send({productsCountByStore:countResult,products:productsArray});
                    });  
                    }) //End of foreach
                })
                .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
            }
            else
            {
                product.getProductById(productId)
                .then(productResult => {    
                if(productResult == null)
                    res.send({error:"Error! Didn't find a product with that id."});
                else
                {
                    imageToBase64(productResult.image)
                    .then((base64Image) => {
                        product.image = base64Image;
                    res.send(productResult);
                    })
                    .catch(err => res.send({error:"Error converting image.    "+err}));
                }
                })
                .catch(err => res.send({error:"Error getting products of the requested category. "+err}));
            }
        }
        })
        .catch(err => {error:"Error getting caetgory id. "+err});
    }
    })
    .catch(err => res.send({error:"Error getting the store. "+err}));
});
//----------Create Product----------
router.post('/stores/:storeId/category/:categoryId/create-product',userAuthenticated,upload.single('image'),(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    
    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.send({error:"Error! Didn't find a category with that id."})
            else
            {
                //Creating product
                productInfo = {...req.body,storeId:storeId,image:req.file.path,categoryId:categoryId};

                const productValidationResult = product.validateProductInfo(productInfo);
                const warehouseValidationResult = warehouse.validateWarehouseInfo({amount:req.body.amount});
                
                if(typeof productValidationResult !== 'undefined')
                    res.send(productValidationResult.err);
                else if(typeof warehouseValidationResult !== 'undefined')
                    res.send(warehouseValidationResult.err);
                else
                {
                    product.createProduct(productInfo)
                    .then(productResult => {
                    //Adding a ref of the product to the category
                    category.addProduct(categoryId,productResult)
                        .then(categoryResult =>{
                        //Adding the product and its quantity to the warehouse
                        warehouse.addProduct(storeId,productResult._id,categoryId,req.body.amount)
                            .then(warehouseResult => {
                            res.send(productResult);
                            })
                            .catch(err => {
                            res.send({error:"Error updating warehouse. "+err})
                            }); 
                        })
                        .catch(err => {
                        res.send({error:"Error updating category. "+err})
                        });
                    })
                    .catch(err => {
                    res.send({error:"Error creating product. "+err})
                    });
                }            
            }
            }).catch(err => res.send({error:"Error getting category id. "+err}));
        }
        })
        .catch(err => res.send({error:"Error getting store id. "+err}));
    }
});
//----------Update Product----------
router.put('/stores/:storeId/category/:categoryId/update-product/:productId',userAuthenticated,upload.single('image'),(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    productId = req.params.productId;
    
    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.send({error:"Error! Didn't find a category with that id."})
            else
            {
                product.exists(productId)
                .then(getProductResult => {
                if(getProductResult == null)
                    res.send({error:"Error! Didn't find a produt with that id."})
                else
                {
                    productInfo = {...req.body,image:req.file.path};
                    if(req.body.amount === 0)
                        productInfo={...productInfo,isInStock:false};
                    
                    const productValidationResult = product.validateProductInfo(productInfo);
                    const warehouseValidationResult = warehouse.validateWarehouseInfo({amount:req.body.amount});
                    
                    if(typeof productValidationResult !== 'undefined')
                        res.send(productValidationResult.err);
                    else if(typeof warehouseValidationResult !== 'undefined')
                        res.send(warehouseValidationResult.err);
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
                                                res.send(productFindResult);
                                                })
                                                .catch(err => res.send({error:"Error finding updated product.  "+err}))
                                            })
                                            .catch(err => {
                                            res.send({error:"Error adding product to warehouse. "+err})
                                            });
                                        })
                                        .catch(err => {
                                        res.send({error:"Error removing product from warehouse. "+err})
                                        });
                                    })
                                    .catch(err => {
                                    res.send({error:"Error adding product to category. "+err})
                                    });
                                })
                                .catch(err => {
                                res.send({error:"Error removing product from category. "+err})
                                }); 
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
                                        res.send(productFindResult);
                                        })
                                        .catch(err => res.send({error:"Error finding updated product.  "+err}))
                                    })
                                    .catch(err => {
                                    res.send({error:"Error adding product to warehouse. "+err})
                                    });
                                })
                                .catch(err => {
                                res.send({error:"Error removing product from warehouse. "+err})
                                });
                            }
                            })
                            .catch(err => {
                            res.send({error:"Error updating product. "+err})
                            }); 
                        })
                        .catch(err => res.send({error:"Couldn't find a category with that name. "+err}));
                    }
                }
                })
                .catch(err => res.send({error:"Error getting product by id.    "+err}));
            }
            })
            .catch(err => res.send({error:"Error getting category id. "+err}))
        }
        })
        .catch(err => res.send({error:"Error getting store id. "+err}));    
    }
});
//----------Delete Product----------
router.delete('/stores/:storeId/category/:categoryId/delete-product/:productId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    categoryId = req.params.categoryId;
    productId = req.params.productId;
    
    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find a store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            //Checking if the category exists by it's ID
            category.exists(categoryId)
            .then(getCategoryResult => {
            if(getCategoryResult == null)
                res.send({error:"Error! Didn't find a category with that id."})
            else
            {
                product.exists(productId)
                .then(getProductResult => {
                if(getProductResult == null)
                    res.send({error:"Error! Didn't find a produt with that id."})
                else
                {
                    //Deleting product
                    product.removeProduct(productId)
                    .then(deleteProductResult => {
                    //2- Updating the products list inside the category's list 
                    //Removing product ref from the category
                    category.removeProductFromCategory(categoryId,productId)
                        .then(updateCategoryResult => {
                        //Updating the warehouse
                        warehouse.removeProductFromWarehouse(storeId,productId)
                            .then(warehouseResult => {
                            res.send("Deleted product and updated warehouse and category")
                            })
                            .catch(err => res.send({error:"Error updating warehouse. "+err}));
                        })
                        .catch(err => res.send({error:"Error updating category. "+err}));
                    })
                    .catch(err => res.send({error:"Error deleting product. "+err}));
                }
                })
                .catch(err => res.send({error:"Error getting product by id.    "+err}));
            }
            })
            .catch(err => res.send({error:"Error getting category id. "+err}))
        }
        })
        .catch(err => res.send({error:"Error getting store id. "+err}));    
    }
});

module.exports = router;