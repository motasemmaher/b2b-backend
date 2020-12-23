const express = require("express");
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');
const limitAndSkipValidation = require('./src/validations/limitAndSkipValidation');
const bodyParser = require('body-parser');

//Setting-up req body parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))

const Offer = require('../business/Offer/Offer');
const offer = new Offer();

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
    if(getStoreResult == null)
        res.send({error:"Error! Didn't find a store with thats id."});
    else
    {
        product.getProductsWithOffers(storeId,limit,skip)
        .then(offersResult => {
        product.countByOffers(storeId)
            .then(countResult => {
            offersArray = offersResult;
            offersArray.forEach((offerResult,index,offersArray) => {
                imageToBase64(productRofferResultesult.image)
                .then(base64Image => {
                offerResult.image = base64Image;       
                if(index  === offersArray.length - 1)
                    res.send({count:countResult,offers:offersArray});
                })
                .catch(err => {
                    console.log({error:"Error converting image.    "+err})
                    if (!res.headersSent)
                    res.send({count:countResult,offers:offersArray});
                });  
                }) //End of foreach
            })    
            .catch(err => res.send({error:"Error with getting count of offers.  "+err}));
        })
        .catch(err => res.send({error:"Error with getting offers of the store.  "+err}));
    }
    })
    .catch(err => res.send({error:"Error getting the store. "+err}));
});
//----------add Offer----------
router.post('/stores/:storeId/offers/add-offer',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;

    if(loggedUser.role !== "garageOwner")
        res.send({error:"Unauthorized user"});
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            productOffers = req.body.productOffers;
            productOffers.forEach(productOffer =>{
                newPrice = productOffer['price'] - (productOffer['price']*(productOffer['discountRate']/100));
                const offerValidationResult = offer.validateOfferInfo({discountRate:productOffer['discountRate'],
                                                                       duration:productOffer['duration'],
                                                                       newPrice:newPrice});
                if(typeof offerValidationResult !== 'undefined')
                    res.send(offerValidationResult.err);
                else
                {           
                    offer.createOffer(productOffer['discountRate'],productOffer['duration'],newPrice)
                    .then(offerResult => {
                    product.addOffer(productOffer['productId'],offerResult)
                        .then(productResult => {
                        res.send("Added offer successfuly");
                        })
                        .catch(err => {
                        res.send({error:"Error with adding offer to product. "+err});
                        offer.deleteOffer(offerResult._id);
                        });
                    })
                    .catch(err => res.send({error:"Error with creating offer. "+err}));
                }
            });    
        }
        })
        .catch(err => res.send({error:"Error getting store with that id.    "+err}));
    }
});
//----------delete Offer----------
router.delete('/stores/:storeId/offers/delete-offer/:offerId',userAuthenticated,(req,res) => {
    loggedUser = req.user;
    storeId = req.params.storeId;
    offerId = req.params.offerId;

    if(loggedUser.role !== "garageOwner")
        res.send("Unauthorized user")
    else
    {
        store.exists(storeId)
        .then(getStoreResult => {
        if(getStoreResult == null)
            res.send({error:"Error! Didn't find store with that id."});
        else if(getStoreResult.userId != loggedUser._id)
            res.send({error:"Error! The requested store doesn't belong to this garage owner."});
        else
        {
            offer.exists(offerId)
            .then(getOfferResult => {
            if(getOfferResult == null)
                res.send({error:"Error! Didn't find offer with that id."});
            else
            {
                product.removeOffer(offerId)
                .then(productResult => {
                offer.deleteOffer(offerId)
                    .then(offerResult => {
                    res.send("Deleted offer");
                    })
                    .catch(err => res.send({error:"Error with deleting offer. "+err}));
                })
                .catch(err => res.send({error:"Error with removing offer from the product. "+err}));
            }
            })
            .catch(err => res.send({error:"Error with getting offer id. "+err}));
        }
        })
        .catch(err => res.send({error:"Error getting store with that id.    "+err}));
    }
});

module.exports = router;
