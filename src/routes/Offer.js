const express = require("express");
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');

const offer = require('../business/Objects').OFFER;
const store = require('../business/Objects').STORE;
const product = require('../business/Objects').PRODUCT;

//----------View all products with offers ----------
router.get('/offers',(req,res) => {
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    product.getProductsWithOffers(limit,skip)
    .then(offersResult => {
    product.countByOffers()
        .then(countResult => {
        offersArray = offersResult;
        if(offersArray.length == 0)
            return res.status(200).send({count:0,offers:[]});
        // offersArray.forEach((offerResult,index,offersArray) => {
        //     imageToBase64(productRofferResultesult.image)
        //     .then(base64Image => {
        //     offerResult.image = base64Image;       
        //     if(index  === offersArray.length - 1)
                return res.status(200).send({count:countResult,offers:offersArray});
            // })
            // .catch(err => {
            //     console.log({error:"Error converting image.    "+err})
            //     if (!res.headersSent)
            //     return res.status(200).send({count:countResult,offers:offersArray});
            // });  
            // }) //End of foreach
        })    
        .catch(err => {return res.status(500).send({error:"Error with getting count of offers.  "+err})});
    })
    .catch(err => {return res.status(500).send({error:"Error with getting offers.  "+err})});
});
//----------View products with offers of a store----------
router.get('/stores/:storeId/offers',(req,res) => {
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    storeId = req.params.storeId;

    store.exists(storeId)
    .then(getStoreResult => {
    if(!getStoreResult)
        return res.status(404).send({error:"Error! Didn't find a store with thats id."});
    else
    {
        product.getProductsWithOffersOfStore(storeId,limit,skip)
        .then(offersResult => {
        product.countByOffersOfStore(storeId)
            .then(countResult => {
            offersArray = offersResult;
            if(offersArray.length == 0)
                return res.status(200).send({count:0,offers:[]});
            // offersArray.forEach((offerResult,index,offersArray) => {
            //     imageToBase64(productRofferResultesult.image)
            //     .then(base64Image => {
            //     offerResult.image = base64Image;       
            //     if(index  === offersArray.length - 1)
                    return res.status(200).send({count:countResult,offers:offersArray});
                // })
                // .catch(err => {
                //     console.log({error:"Error converting image.    "+err})
                //     if (!res.headersSent)
                //     return res.status(200).send({count:countResult,offers:offersArray});
                // });  
                // }) //End of foreach
            })    
            .catch(err => {return res.status(500).send({error:"Error with getting count of offers.  "+err})});
        })
        .catch(err => {return res.status(500).send({error:"Error with getting offers of the store.  "+err})});
    }
    })
    .catch(err => {return res.status(500).send({error:"Error getting the store. "+err})});
});
//----------add Offer----------
router.post('/stores/:storeId/offers/add-offer',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;

    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    if(loggedUser.role !== "garageOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    
    store.exists(storeId)
    .then(getStoreResult => {
    if(!getStoreResult)
        return res.status(404).send({error:"Error! Didn't find store with that id."});
    else if(getStoreResult.userId != loggedUser._id)
        return res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
    
    let errors = {};
    let count = 0;
    productOffers = req.body.productOffers;


    productOffers.forEach((productOffer,index,productOffers) => {
        product.getProductById(productOffer['productId'])
        .then(productResult => {
            
        if(productResult == null)
        {
            count++;
            errors[productOffer['productId']] = "No such product witht that ID";
            if(index  === productOffers.length - 1)            
                return res.status(200).send({
                    message:"Processed offers successfuly with "+count+" errors",
                    errors:errors
                });
        }
        else
        {
            newPrice = productResult.price - (productResult.price*(productOffer['discountRate']/100));
            const offerValidationResult = offer.validateOfferInfo({discountRate:productOffer['discountRate'],
                                                                    duration:productOffer['duration'],
                                                                    newPrice:newPrice});
            if(typeof offerValidationResult !== 'undefined')
            {
                count++;
                errors[productResult._id] = offerValidationResult.error;
                if(index  === productOffers.length - 1)            
                   return res.status(200).send({
                        message:"Processed offers successfuly with "+count+" errors",
                        errors:errors
                    });
            }
            else
            {           
                offer.createOffer(productOffer['discountRate'],productOffer['duration'],newPrice)
                .then(offerResult => {
                product.addOffer(productOffer['productId'],offerResult)
                    .then(updatedProductResult => {
                        if(index  === productOffers.length - 1)            
                            return res.status(200).send({
                                message:"Processed offers successfuly with "+count+" errors",
                                errors:errors
                            });
                    })
                    .catch(err => {
                        offer.deleteOffer(offerResult._id);
                        count++;
                        errors[productResult._id] = "Errors with adding offer to product. "+err;
                        if(index  === productOffers.length - 1)            
                            return res.status(200).send({
                                message:"Processed offers successfuly with "+count+" errors",
                               errors:errors
                            });
                    });
                })
                .catch(err => {
                    count++;
                    errors[productResult._id] = "Errors with creating offer. "+err;
                    
                    if(index  === productOffers.length - 1)            
                        return res.status(200).send({
                            message:"Processed offers successfuly with "+count+" errors",
                            errors:errors
                        });
                });
            }
        }
        })
        .catch(err => {
            count++;
            errors[productOffer['productId']] = "Errors with getting product. "+err;
            
            if(index  === productOffers.length - 1)            
               return res.status(200).send({
                        message:"Processed offers successfuly with "+count+" errors",
                        errors:errors
                    });
        });
    });//End of foreach 
    })
    .catch(err => {return res.status(500).send({error:"Error getting store with that id.    "+err})});
    
});
//----------delete Offer----------
router.delete('/stores/:storeId/offers/delete-offer/:offerId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    offerId = req.params.offerId;

    if(loggedUser.role !== "garageOwner")
        return res.status(401).send({error:"Unauthorized user !"})
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(!getStoreResult)
            return res.status(404).send({error:"Error! Didn't find store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            return res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
        
        offer.exists(offerId)
        .then(getOfferResult => {
        if(!getOfferResult)
            return res.status(404).send({error:"Error! Didn't find offer with that id."});
        else
        {
            product.removeOffer(offerId)
            .then(productResult => {
            offer.deleteOffer(offerId)
                .then(offerResult => {
                    return res.status(200).send({success:true});
                })
                .catch(err => {return res.status(500).send({error:"Error with deleting offer. "+err})});
            })
            .catch(err => {return res.status(500).send({error:"Error with removing offer from the product. "+err})});
        }
        })
        .catch(err => {return res.status(500).send({error:"Error with getting offer id. "+err})});
        
        })
        .catch(err => {return res.status(500).send({error:"Error getting store with that id.    "+err})});
    }
});

module.exports = router;
