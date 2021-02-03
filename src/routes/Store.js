//Requiring the necessay files, middlewares and packages
const express = require('express');
const router = express.Router();
const upload = require('../shared/imageUpload');
const imageToBase64 = require('image-to-base64');
const uploadImage = require('../shared/uploadImage');
const randomId = require('../shared/generateRandomId');
const { userAuthenticated } = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');
const latAndLongValidation = require('../shared/latAndLongValidation');
//Requiring the necessay objects
const store = require('../business/Objects').STORE;
const category = require('../business/Objects').CATEGORY;
const product = require('../business/Objects').PRODUCT;
const garageOwner = require('../business/Objects').GARAGEOWNER;
const menu = require('../business/Objects').MENU;
const warehouse = require('../business/Objects').WAREHOUSE;

//----------View Stores and View a store----------
router.get('/stores/:storeId?', (req, res) => {
    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //If no storeId was passed in the url, then get all the store
    if (req.params.storeId == null) {
        //Getting all the stores
        store.getAllStores(limit, skip)
            .then(storesResult => {
            //Getting the count of all the stores
            store.countAll()
                .then(countResult => {
                storesArray = storesResult;
                //If the array of store is empty, then return a successful rsponse
                if (storesArray.length == 0)
                    return res.status(200).send({ count: 0, stores: [] });
                // storesArray.forEach((storeResult,index,storesArray) => {
                //     imageToBase64(storeResult.image)
                //     .then(base64Image => {
                //     storeResult.image = base64Image;       
                //     if(index  === storesArray.length - 1)
                //Returning a successful response
                return res.status(200).send({ count: countResult, stores: storesArray });

                //     })
                //     .catch(err => {
                //         console.log({error:"Error converting image.    "+err})
                //         if (!res.headersSent
                //             returnres.status(200).send({count:countResult,stores:storesArray});
                //     });  
                // }) //End of foreach
                })
                //If getting the count runs into error, then return an error response
                .catch(err => {return res.status(500).send({ error: "Error with getting count of all stores.  " + err })});
            })
            //If getting all the stores runs into error, then return an error response
            .catch(err => {return res.status(500).send({ error: "Error getting all stores. " + err })});
    }
    //If storeId was passed in the url, then get the store
    else 
    {
        //Getting the store
        store.getStoreById(req.params.storeId)
            .then(storeResult => {
            //If the store doesn't exist, then return an error response
            if (storeResult == null)
                return res.status(404).send({ error: "Error! Didn't find a store with thats id." });
            else {
                // imageToBase64(storeResult.image)
                // .then((base64Image) => {
                // storeResult.image = base64Image;
                //Returning a successful response
                return res.status(200).send(storeResult);
                // })
                // .catch(err => {return res.status(500).send({error:"Error converting image.    "+err})});
            }
            })
            //If getting the store runs into error, then return an error response
            .catch(err => {return res.status(500).send({ error: "Error getting the store. " + err })});
    }
});
//----------View nearby stores----------
router.get('/view-stores/nearby', (req, res) => {
    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //getting the stores that shared the same address as the logged user
    const loggedUser = req.user;
    store.getSameAddressStores(loggedUser.address, limit, skip)
        .then(storesResult => {
        //Getting the count of the nearby stores
        store.countBySameAddress()
            .then(countResult => {
                storesArray = storesResult;
                //If the returned array was empty, the return a successful response
                if (storesArray.length == 0)
                    return res.status(200).send({ count: 0, stores: [] });
                // storesArray.forEach((storeResult,index,storesArray) => {
                // imageToBase64(storeResult.image)
                // .then(base64Image => {
                // storeResult.image = base64Image;       
                // if(index  === storesArray.length - 1)
                //Returning a successful response
                return res.status(200).send({ count: countResult, stores: storesArray });
                // })
                // .catch(err => {
                //     console.log({error:"Error converting image.    "+err})
                //     if (!res.headersSent)
                //         return res.status(200).send({count:countResult,stores:storesArray});
                // });  
                // }) //End of foreach
            })
            //If getting the count runs into error, then return an error response
            .catch(err => { return res.status(500).send({ error: "Error with getting count of all nearby stores.  " + err })});
        })
        //If getting the store runs into error, then return an error response
        .catch(err => {return res.status(500).send({ error: "Error getting all nearby stores. " + err })});
});
//----------View nearby stores by location----------
router.get('/view-stores/location', userAuthenticated,(req, res) => {
    console.log("inside")
    //Getting and checking if the logged user is an authorized one, if not then return error response
    loggedUser = req.user;
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //Checking the values of latitude and longitude
    lat = req.query.lat;
    long = req.query.long;
    const latAndLongValidationResult = latAndLongValidation.validatingLatAndLong(lat,long);
    //If errors were found, return an error response
    if(latAndLongValidationResult !== "pass")
        return res.status(400).send(latAndLongValidationResult);
    //Getting all stores sorted asc. by distance from the current loggedUser location
    store.getStoresByLocation(lat,long, limit, skip)
        .then(storesResult => {
        //Getting the count of all store
        store.countAll()
            .then(countResult => {
            //If the returned array was empty, the return a successful response
            storesArray = storesResult;
            if (storesArray.length == 0)
                return res.status(200).send({ count: 0, stores: [] });
            // storesArray.forEach((storeResult,index,storesArray) => {
            // imageToBase64(storeResult.image)
            // .then(base64Image => {
            // storeResult.image = base64Image;       
            // if(index  === storesArray.length - 1)
            //Returning a successful response
            return res.status(200).send({ count: countResult, stores: storesArray });
            // })
            // .catch(err => {
            //     console.log({error:"Error converting image.    "+err})
            //     if (!res.headersSent)
            //         return res.status(200).send({count:countResult,stores:storesArray});
            // });  
            // }) //End of foreach
            })
            //If getting the count runs into error, then return an error response
            .catch(err => {return res.status(500).send({ error: "Error with getting count of all stores.  " + err })});
        })
        //If getting the stores runs into error, then return an error response
        .catch(err => {return res.status(500).send({ error: "Error getting stores by location. " + err })});
});
//----------View Garage Owner's stores----------
router.get('/user/manage-garage-owner/stores', userAuthenticated, (req, res) => {
    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //Getting and checking if the logged user is an authorized one, if not then return error response
    const loggedUser = req.user;
    if (loggedUser.role !== "garageOwner")
        return res.status(401).send({ error: "Unauthorized user !" });
    else 
    {
        //Getting all tho stores of the loggedUser
        store.getFullStoresByUserId(loggedUser._id, limit, skip)
            .then(storesResult => {
            //Getting the count of the stores
            store.countByGarageOwner(loggedUser._id)
                .then(countResult => {
                //If the returned array was empty, the return a successful response
                storesArray = storesResult;
                if (storesArray.length == 0)
                    return res.status(200).send({ count: 0, stores: [] });
                // storesArray.forEach((storeResult,index,storesArray) => {
                //     imageToBase64(storeResult.image)
                //     .then(base64Image => {
                //     storeResult.image = base64Image;       
                //     if(index  === storesArray.length - 1)
                //Returning a successful response
                return res.status(200).send({ count: countResult, stores: storesArray });
                //     })
                //     .catch(err =>  {
                //         console.log({error:"Error converting image.    "+err});
                //         if (!res.headersSent)
                //             return res.status(200).send({count:countResult,stores:storesArray});
                //     });
                // }) //End of foreach
                })
                //If getting the count runs into error, then return an error response
                .catch(err => {return res.status(500).send({ error: "Error with getting count of garage owner's stores.  " + err })});
            })
            //If getting the stores runs into error, then return an error response
            .catch(err => {return res.status(500).send({ error: "Error with getting stores of the garageowner. " + err })});
    }
});
//----------Getting the Garage Owner's Store Ids----------
router.get('/user/manage-garage-owner/stores/storesId', userAuthenticated, (req, res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response
    const loggedUser = req.user;
    if (loggedUser.role !== "garageOwner")
        return res.status(401).send({ error: "Unauthorized user !" });
    else 
    {
        //Gettign the stores
        store.getStoresIdByUserId(loggedUser._id)
            .then(storesResult => {
            //Returning a successful response
            return res.status(200).send({ count: 0, storesId: storesResult });
            })
            //If getting the store ids runs into error, then return an error response
            .catch(err => res.status(500).send({ error: "Error with getting stores of the garageowner. " + err }));
    }
});
//----------Add Store----------
router.post('/user/manage-garage-owner/add-store', userAuthenticated, upload.single('image'),(req, res) => { // upload.single('image'),
    //Getting and checking if the logged user is an authorized one, if not then return error response    
    const loggedUser = req.user;
    if (loggedUser.role !== "garageOwner")
        return res.status(401).send({ error: "Unauthorized user !" });
    //Checking if the request body id empty or not, if it is then return error response
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    else 
    {
        //Storing the data from the request body then validating it
        //const storeInfo = {...req.body,image:req.file.path,userId:loggedUser._id};
        storeInfo = { ...req.body, userId: loggedUser._id };
        const storeValidationResult = store.validateStoreInfo(storeInfo);
        //If errors were found, then return error response
        if (typeof storeValidationResult !== 'undefined')
            return res.status(400).send({ error: storeValidationResult.error });
        else 
        {
            //Generating random id to be used as an image name
            const randomIdValue = randomId.generateId();
            const path = `public/images/${randomIdValue}.png`;
            storeInfo = {...storeInfo,image:path};
            //Creating menu
            menu.createMenu()
                .then(menuResult => {
                //Creating warehouse
                warehouse.createWarehouse()
                    .then(warehouseResult => {
                    //Creating store
                    store.createStore({ ...storeInfo, menu: menuResult, warehouse: warehouseResult })
                        .then(storeResult => {
                        //Linking the warehouse and menu to the store via storeId
                        warehouse.linkWarehouse({ _id: warehouseResult._id, storeId: storeResult._id });
                        menu.linkMenu({ _id: menuResult._id, storeId: storeResult._id });
                        //Getting the garageOwner
                        garageOwner.getGarageOwnerByUserId(loggedUser._id)
                            .then(garageOwnerResult => {
                            //Adding the store to the garageOwner list
                            garageOwner.addStoreToList(garageOwnerResult._id, storeResult)
                                .then(addingResult => {
                                //Uploading image to the server
                                uploadImage.upload(path,req.body.image);
                                //Returning a successful response
                                return res.status(200).send(addingResult);
                                })
                                //If adding store to the list runs into error, then return an error response
                                .catch(err => {
                                    store.deleteStore(storeResult._id);
                                    menu.deleteMenu(menuResult._id);
                                    warehouse.deleteWarehouse(warehouseResult._id);
                                    return res.status(500).send({ error: "Error adding store to list: " + err });
                                });
                            })
                            //If getting the garageOwner runs into error, then return an error response
                            .catch(err => {
                                store.deleteStore(storeResult._id);
                                menu.deleteMenu(menuResult._id);
                                warehouse.deleteWarehouse(warehouseResult._id);
                                return res.status(500).send({ error: "Error with getting garageOwner: " + err });
                            });
                        })
                        //If craeting the store runs into error, then return an error response
                        .catch(err => {
                            menu.deleteMenu(menuResult._id);
                            warehouse.deleteWarehouse(warehouseResult._id);
                            return res.status(500).send({ error: "Error with creating Store: " + err });
                        });
                    })
                    //If creating warehouse runs into error, then return an error response
                    .catch(err => {
                        menu.deleteMenu(menuResult._id);
                        return res.status(500).send({ error: "Error with creating Warehouse: " + err });
                    });
                })
                //If creating menuruns into error, then return an error response
                .catch(err => {
                    return res.status(500).send({ error: "Error with creating Menu: " + err });
                });
        }
    }
});
//----------Update Store----------
router.put('/user/manage-garage-owner/update-store/:storeId', userAuthenticated, (req, res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response    
    const loggedUser = req.user;
    if (loggedUser.role !== "garageOwner")
        return res.status(401).send({ error: "Unauthorized user !" });
    //Checking if the request body id empty or not, if it is then return error response
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    else 
    {
        //Cheking if the store exists
        storeId = req.params.storeId;
        store.exists(storeId)
            .then(getStoreResult => {
            //If the store doesn't exist, then return an error response
            if (!getStoreResult)
                return res.status(404).send({ error: "Error! Didn't find store with that id." });
            //If the store doesn't belong to the current logged user, then return an error response
            else if (getStoreResult.userId != loggedUser._id)
                return res.status(401).send({ error: "Error! The requested store doesn't belong to this garage owner." });
            else
            {
                //Generating random id to be used as an image name
                const randomIdValue = randomId.generateId();
                const path = `public/images/${randomIdValue}.png`;
                //Storing data from the request body then validating them
                const body = req.body;
                const storeInfo = { _id: storeId, ...body ,image:path}; // , image: req.file.path
                const storeValidationResult = store.validateStoreInfo(storeInfo);
                //If error was found, then return an error response
                if (typeof storeValidationResult !== 'undefined')
                    return res.status(400).send({ error: storeValidationResult.error });
                else 
                {
                    //Updating store
                    store.updateStore(storeInfo)
                        .then(storeResult => {
                        //Getting store
                        store.getStoreById(storeResult._id)
                            .then(updatedStore => {
                            //Uploading image to the server
                            uploadImage.upload(path,req.body.image);
                            //Returning a successful response
                            return res.status(200).send(updatedStore);
                            })
                            //If getting the  store runs into error, then return an error response
                            .catch(error => {return res.status(500).send({ error: "Error with getting Store: " + error })});
                        })
                        //If updating the  store runs into error, then return an error response
                        .catch(error => {return res.status(500).send({ error: "Error with updating Store: " + error })});
                }
            }
            })
            //If getting the store runs into error, then return an error response
            .catch(err => {return res.status(500).send({ error: "Error getting store with that id.    " + err })});
    }
});
//----------Delete Store----------
router.delete('/user/manage-garage-owner/delete-store/:storeId', userAuthenticated, (req, res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response    
    const loggedUser = req.user;
    if (loggedUser.role !== "garageOwner")
        return res.status(401).send({ error: "Unauthorized user !" });
    else
    {
        //Checking if the store exists
        const storeId = req.params.storeId;
        store.exists(storeId)
            .then(getStoreResult => {
            //If it doesn't exists, then return an error response
            if (!getStoreResult)
                return res.status(404).send({ error: "Error! Didn't find store with that id." });
            //If it doesn't belong to the current loggedUser, then return an error response
            else if (getStoreResult.userId != loggedUser._id)
                return res.status(401).send({ error: "Error! The requested store doesn't belong to this garage owner." });
            else 
            {
                //Deleting menu
                menu.deleteMenuByStoreId(storeId)
                    .then(deleteMenuResult => {
                    //Deleting warehouse
                    warehouse.deleteWarehouseByStoreId(storeId)
                        .then(deleteWarehouseResult => {
                        //Getting all the categories of that menu
                        category.getAllCategoriesInUserStores(storeId)
                            .then(categoryIds => {
                            //Deleting all the categories of that menu
                            category.deleteCategoriesByStoreIds(storeId)
                                .then(deletedCategories => {
                                //Deleting the products of the deleted categories
                                product.deleteProductsOfCategoriesId(categoryIds)
                                    .then(deletedProducts => {
                                    //Deleting the store
                                    store.deleteStore(storeId)
                                        .then(deletingStoresResult => {
                                        //Getting the garageOwner
                                        garageOwner.getGarageOwnerByUserId(loggedUser._id)
                                            .then(garageOwnerResult => {
                                            //Removing the store from the stores list of the garage Owner
                                            garageOwner.removeStoreFromList(garageOwnerResult._id, storeId)
                                                .then(removeResult => {
                                                //Returning a successful response
                                                return res.status(200).send({ success: true });
                                                })
                                                //If removing store from the list runs into error, then return an error response
                                                .catch(err => {return res.status(500).send({ error: "Error removing store from the garageOwner. " + err })});
                                            })
                                            //If getting the garageOwner runs into error, then return an error response
                                            .catch(err => {return res.status(500).send({ error: "Error getting garageOwner. " + err })});
                                        })
                                        //If deleting the store runs into error, then return an error response
                                        .catch(err => {return res.status(500).send({ error: "Error deleting the stores. " + err })});
                                    })
                                    //If deleting the products of the store runs into error, then return an error response
                                    .catch(err => {return res.status(500).send({ error: "Error deleting the products of these categories. " + err })});
                                })
                                //If deleting the categories of the store runs into error, then return an error response
                                .catch(err => {return res.status(500).send({ error: "Error deleting categorie sof these stores. " + err })});
                            })
                            //If getting the category Ids store runs into error, then return an error response
                            .catch(err => {return res.status(500).send({ error: "Error getting category ids of these stores. " + err })});
                        })
                        //If deleting the warehouse runs into error, then return an error response
                        .catch(err => {return res.status(500).send({ error: "Error deleting the warehouse. " + err })});
                    })
                    //If deleting the menu runs into error, then return an error response
                    .catch(err => {return res.status(500).send({ error: "Error deleting the menu. " + err })});
            }
            })
            //If getting the store runs into error, then return an error response
            .catch(err => {return res.status(500).send({ error: "Error getting store with that id.    " + err })});
    }
});
//Exporting the route
module.exports = router;