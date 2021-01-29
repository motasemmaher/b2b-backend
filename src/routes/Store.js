const express = require('express');
const router = express.Router();
const upload = require('../shared/imageUpload');
const imageToBase64 = require('image-to-base64');
const uploadImage = require('../shared/uploadImage');
const randomId = require('../shared/generateRandomId');
const { userAuthenticated } = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');
const latAndLongValidation = require('../shared/latAndLongValidation');

const store = require('../business/Objects').STORE;
const category = require('../business/Objects').CATEGORY;
const product = require('../business/Objects').PRODUCT;
const garageOwner = require('../business/Objects').GARAGEOWNER;
const menu = require('../business/Objects').MENU;
const warehouse = require('../business/Objects').WAREHOUSE;


//----------View Stores and View a store----------
router.get('/stores/:storeId?', (req, res) => {
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    if (req.params.storeId == null) {
        store.getAllStores(limit, skip)
            .then(storesResult => {
                store.countAll()
                    .then(countResult => {
                        storesArray = storesResult;
                        if (storesArray.length == 0)
                            return res.status(200).send({ count: 0, stores: [] });
                        // storesArray.forEach((storeResult,index,storesArray) => {
                        //     imageToBase64(storeResult.image)
                        //     .then(base64Image => {
                        //     storeResult.image = base64Image;       
                        //     if(index  === storesArray.length - 1)
                        res.status(200).send({ count: countResult, stores: storesArray });

                        //     })
                        //     .catch(err => {
                        //         console.log({error:"Error converting image.    "+err})
                        //         if (!res.headersSent
                        //             res.status(200).send({count:countResult,stores:storesArray});
                        //     });  
                        // }) //End of foreach
                    })
                    .catch(err => res.status(500).send({ error: "Error with getting count of all stores.  " + err }));
            })
            .catch(err => res.status(500).send({ error: "Error getting all stores. " + err }));
    }
    else {
        store.getStoreById(req.params.storeId)
            .then(storeResult => {
                if (storeResult == null)
                    res.status(404).send({ error: "Error! Didn't find a store with thats id." });
                else {
                    // imageToBase64(storeResult.image)
                    // .then((base64Image) => {
                    // storeResult.image = base64Image;
                    res.status(200).send(storeResult);
                    // })
                    // .catch(err => res.status(500).send({error:"Error converting image.    "+err}));
                }
            })
            .catch(err => res.status(500).send({ error: "Error getting the store. " + err }));
    }
});
//----------View nearby stores----------
router.get('/view-stores/nearby', (req, res) => {
    const loggedUser = req.user;
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    store.getSameAddressStores(loggedUser.address, limit, skip)
        .then(storesResult => {
            store.countBySameAddress()
                .then(countResult => {
                    storesArray = storesResult;
                    if (storesArray.length == 0)
                        return res.status(200).send({ count: 0, stores: [] });
                    // storesArray.forEach((storeResult,index,storesArray) => {
                    // imageToBase64(storeResult.image)
                    // .then(base64Image => {
                    // storeResult.image = base64Image;       
                    // if(index  === storesArray.length - 1)
                    res.status(200).send({ count: countResult, stores: storesArray });
                    // })
                    // .catch(err => {
                    //     console.log({error:"Error converting image.    "+err})
                    //     if (!res.headersSent)
                    //         res.status(200).send({count:countResult,stores:storesArray});
                    // });  
                    // }) //End of foreach
                })
                .catch(err => res.status(500).send({ error: "Error with getting count of all nearby stores.  " + err }));
        })
        .catch(err => res.status(500).send({ error: "Error getting all nearby stores. " + err }));
});
//----------View nearby stores by location----------
router.get('/view-stores/location', userAuthenticated,(req, res) => {
    loggedUser = req.user;
    if(loggedUser.role !== "carOwner")
        return res.status(401).send({error:"Unauthorized user !"});

    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    lat = req.query.lat;
    long = req.query.long;
    const latAndLongValidationResult = latAndLongValidation.validatingLatAndLong(lat,long);
    if(latAndLongValidationResult !== "pass")
        return res.status(400).send(latAndLongValidationResult);

    store.getStoresByLocation(lat,long, limit, skip)
        .then(storesResult => {
            store.countAll()
                .then(countResult => {
                    storesArray = storesResult;
                    if (storesArray.length == 0)
                        return res.status(200).send({ count: 0, stores: [] });
                    // storesArray.forEach((storeResult,index,storesArray) => {
                    // imageToBase64(storeResult.image)
                    // .then(base64Image => {
                    // storeResult.image = base64Image;       
                    // if(index  === storesArray.length - 1)
                    return res.status(200).send({ count: countResult, stores: storesArray });
                    // })
                    // .catch(err => {
                    //     console.log({error:"Error converting image.    "+err})
                    //     if (!res.headersSent)
                    //         res.status(200).send({count:countResult,stores:storesArray});
                    // });  
                    // }) //End of foreach
                })
                .catch(err => res.status(500).send({ error: "Error with getting count of all stores.  " + err }));
        })
        .catch(err => res.status(500).send({ error: "Error getting stores by location. " + err }));
});
//----------View Garage Owner's stores----------
router.get('/user/manage-garage-owner/stores', userAuthenticated, (req, res) => {
    const loggedUser = req.user;
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    if (loggedUser.role !== "garageOwner")
        res.status(401).send({ error: "Unauthorized user !" });
    else {
        store.getFullStoresByUserId(loggedUser._id, limit, skip)
            .then(storesResult => {
                store.countByGarageOwner(loggedUser._id)
                    .then(countResult => {
                        storesArray = storesResult;
                        if (storesArray.length == 0)
                            return res.status(200).send({ count: 0, stores: [] });
                        // storesArray.forEach((storeResult,index,storesArray) => {
                        //     imageToBase64(storeResult.image)
                        //     .then(base64Image => {
                        //     storeResult.image = base64Image;       
                        //     if(index  === storesArray.length - 1)
                        res.status(200).send({ count: countResult, stores: storesArray });
                        //     })
                        //     .catch(err =>  {
                        //         console.log({error:"Error converting image.    "+err});
                        //         if (!res.headersSent)
                        //             res.status(200).send({count:countResult,stores:storesArray});
                        //     });
                        // }) //End of foreach
                    })
                    .catch(err => res.status(500).send({ error: "Error with getting count of garage owner's stores.  " + err }));
            })
            .catch(err => res.status(500).send({ error: "Error with getting stores of the garageowner. " + err }));
    }
});
//----------Add Store----------
router.post('/user/manage-garage-owner/add-store', userAuthenticated, upload.single('image'),(req, res) => { // upload.single('image'),
    const loggedUser = req.user;

    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    if (loggedUser.role !== "garageOwner")
        return res.status(401).send({ error: "Unauthorized user !" });
    else {
        //const storeInfo = {...req.body,image:req.file.path,userId:loggedUser._id};
        const storeInfo = { ...req.body, userId: loggedUser._id };
        const storeValidationResult = store.validateStoreInfo(storeInfo);
        if (typeof storeValidationResult !== 'undefined')
            res.status(400).send({ error: storeValidationResult.error });
        else {
            const randomIdValue = randomId.generateId();
            const path = `public/images/${randomIdValue}.png`;
            storeInfo = {...storeInfo,image:path};
            menu.createMenu()
                .then(menuResult => {
                    warehouse.createWarehouse()
                        .then(warehouseResult => {
                            store.createStore({ ...storeInfo, menu: menuResult, warehouse: warehouseResult })
                                .then(storeResult => {
                                    warehouse.linkWarehouse({ _id: warehouseResult._id, storeId: storeResult._id });
                                    menu.linkMenu({ _id: menuResult._id, storeId: storeResult._id });
                                    garageOwner.getGarageOwnerByUserId(loggedUser._id)
                                        .then(garageOwnerResult => {
                                            garageOwner.addStoreToList(garageOwnerResult._id, storeResult)
                                                .then(addingResult => {
                                                    uploadImage.upload(path,req.body.image);
                                                    res.status(200).send(addingResult);
                                                })
                                                .catch(err => {
                                                    store.deleteStore(storeResult._id);
                                                    menu.deleteMenu(menuResult._id);
                                                    warehouse.deleteWarehouse(warehouseResult._id);
                                                    res.status(500).send({ error: "Error adding store to list: " + err });
                                                });
                                        })
                                        .catch(err => {
                                            store.deleteStore(storeResult._id);
                                            menu.deleteMenu(menuResult._id);
                                            warehouse.deleteWarehouse(warehouseResult._id);
                                            res.status(500).send({ error: "Error with getting garageOwner: " + err });
                                        });
                                })
                                .catch(err => {
                                    menu.deleteMenu(menuResult._id);
                                    warehouse.deleteWarehouse(warehouseResult._id);
                                    res.status(500).send({ error: "Error with creating Store: " + err });
                                });
                        })
                        .catch(err => {
                            menu.deleteMenu(menuResult._id);
                            res.status(500).send({ error: "Error with creating Warehouse: " + err });
                        });
                })
                .catch(err => {
                    res.status(500).send({ error: "Error with creating Menu: " + err });
                });
        }
    }
});
//----------Update Store----------
router.put('/user/manage-garage-owner/update-store/:storeId', userAuthenticated, (req, res) => {
    const loggedUser = req.user;
    storeId = req.params.storeId;

    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    if (loggedUser.role !== "garageOwner")
        return res.status(401).send({ error: "Unauthorized user !" });
    else {
        store.exists(storeId)
            .then(getStoreResult => {
                if (getStoreResult == null)
                    res.status(404).send({ error: "Error! Didn't find store with that id." });
                else if (getStoreResult.userId != loggedUser._id)
                    res.status(401).send({ error: "Error! The requested store doesn't belong to this garage owner." });
                else {
                    const randomIdValue = randomId.generateId();
                    const path = `public/images/${randomIdValue}.png`;
                    const body = req.body;
                    const storeInfo = { _id: storeId, ...body ,image:path}; // , image: req.file.path

                    const storeValidationResult = store.validateStoreInfo(storeInfo);

                    if (typeof storeValidationResult !== 'undefined')
                        res.status(400).send({ error: storeValidationResult.error });
                    else {
                        store.updateStore(storeInfo)
                            .then(storeResult => {
                                store.getStoreById(storeResult._id)
                                    .then(updatedStore => {
                                        uploadImage.upload(path,req.body.image);
                                        res.status(200).send(updatedStore);
                                    })
                                    .catch(error => res.status(500).send({ error: "Error with getting Store: " + error }));
                            })
                            .catch(error => res.status(500).send({ error: "Error with updating Store: " + error }));
                    }
                }
            })
            .catch(err => res.status(500).send({ error: "Error getting store with that id.    " + err }));
    }
});
//----------Delete Store----------
router.delete('/user/manage-garage-owner/delete-store/:storeId', userAuthenticated, (req, res) => {
    const loggedUser = req.user;
    const storeId = req.params.storeId;

    if (loggedUser.role !== "garageOwner")
        res.status(401).send({ error: "Unauthorized user !" });
    else {
        store.exists(storeId)
            .then(getStoreResult => {
                if (getStoreResult == null)
                    res.status(404).send({ error: "Error! Didn't find store with that id." });
                else if (getStoreResult.userId != loggedUser._id)
                    res.status(401).send({ error: "Error! The requested store doesn't belong to this garage owner." });
                else {
                    menu.deleteMenuByStoreId(storeId)
                        .then(deleteMenuResult => {
                            warehouse.deleteWarehouseByStoreId(storeId)
                                .then(deleteWarehouseResult => {
                                    category.getAllCategoriesInUserStores(storeId)
                                        .then(categoryIds => {
                                            category.deleteCategoriesByStoreIds(storeId)
                                                .then(deletedCategories => {
                                                    product.deleteProductsOfCategoriesId(categoryIds)
                                                        .then(deletedProducts => {
                                                            store.deleteStore(storeId)
                                                                .then(deletingStoresResult => {
                                                                    garageOwner.getGarageOwnerByUserId(loggedUser._id)
                                                                        .then(garageOwnerResult => {
                                                                            garageOwner.removeStoreFromList(garageOwnerResult._id, storeId)
                                                                                .then(removeResult => {
                                                                                    res.status(200).send({ success: true });
                                                                                })
                                                                                .catch(err => res.status(500).send({ error: "Error removing store from the garageOwner. " + err }));
                                                                        })
                                                                        .catch(err => res.status(500).send({ error: "Error getting garageOwner. " + err }));
                                                                })
                                                                .catch(err => res.status(500).send({ error: "Error deleting the stores. " + err }));
                                                        })
                                                        .catch(err => res.status(500).send({ error: "Error deleting the products of these categories. " + err }));
                                                })
                                                .catch(err => res.status(500).send({ error: "Error deleting caegoriesof these stores. " + err }));
                                        })
                                        .catch(err => res.status(500).send({ error: "Error getting category ids of these stores. " + err }));
                                })
                                .catch(err => res.status(500).send({ error: "Error deleting the warehouse. " + err }));
                        })
                        .catch(err => res.status(500).send({ error: "Error deleting the menu. " + err }));
                }
            })
            .catch(err => res.status(500).send({ error: "Error getting store with that id.    " + err }));
    }
});

module.exports = router;