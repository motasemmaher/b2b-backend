//Requiring the necessay files, middlewares and packages
const express = require("express");
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');
//Requiring the necessary objects
const offer = require('../business/Objects').OFFER;
const store = require('../business/Objects').STORE;
const product = require('../business/Objects').PRODUCT;
//----------View all products with offers ----------
router.get('/offers',(req,res) => {
    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //Gettign products that have offers
    product.getProductsWithOffers(limit,skip)
    .then(offersResult => {
    //Getting the count of the products with the offers
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
                //Returning successful rseponse
                return res.status(200).send({count:countResult,offers:offersArray});
            // })
            // .catch(err => {
            //     console.log({error:"Error converting image.    "+err})
            //     if (!res.headersSent)
            //     return res.status(200).send({count:countResult,offers:offersArray});
            // });  
            // }) //End of foreach
        })    
        //If getting the count of offers runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error with getting count of offers.  "+err})});
    })
    //If getting the offers runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error with getting offers.  "+err})});
});
//----------View products with offers of a store----------
router.get('/stores/:storeId/offers',(req,res) => {
    //Checking the values of limit and skip
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);
    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;
    //Chekcing if the storeId provided in the url exists
    storeId = req.params.storeId;
    store.exists(storeId)
    .then(getStoreResult => {
    //If it doesn't exist, return error response
    if(!getStoreResult)
        return res.status(404).send({error:"Error! Didn't find a store with thats id."});
    else
    {
        //Getting the products with offers of that store
        product.getProductsWithOffersOfStore(storeId,limit,skip)
        .then(offersResult => {
        //Getting the count of products with offers of that store
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
                    //Retirning successful response
                    return res.status(200).send({count:countResult,offers:offersArray});
                // })
                // .catch(err => {
                //     console.log({error:"Error converting image.    "+err})
                //     if (!res.headersSent)
                //     return res.status(200).send({count:countResult,offers:offersArray});
                // });  
                // }) //End of foreach
            })    
            //If getting the count of offers runs into error, return error response
            .catch(err => {return res.status(500).send({error:"Error with getting count of offers.  "+err})});
        })
        //If getting the offers runs into error, return error response
        .catch(err => {return res.status(500).send({error:"Error with getting offers of the store.  "+err})});
    }
    })
    //If checking if the store exists runs into error, return error response
    .catch(err => {return res.status(500).send({error:"Error getting the store. "+err})});
});
//----------add Offer----------
router.post('/stores/:storeId/offers/add-offer',userAuthenticated,(req,res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response
    loggedUser = req.user;
    if(loggedUser.role !== "garageOwner")
        return res.status(401).send({error:"Unauthorized user !"});
    //Checking if the request body id empty or not, if it is then return error response
    if(Object.keys(req.body).length === 0)
        return res.status(400).send({error:"No data was sent!"});
    //Checking if the provided storeId exists
    storeId = req.params.storeId;
    store.exists(storeId)
    .then(getStoreResult => {
    //If it doesn't exist, return error response
    if(!getStoreResult)
        return res.status(404).send({error:"Error! Didn't find store with that id."});
    //Checking if the store actually belongs to the current logged user
    //If it doesn't, return error response
    else if(getStoreResult.userId != loggedUser._id)
        return res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
    //The code will run a for loop.During the loop if one of the offers fails to be added, it will be stored in the errors array.
    let errors = {};
    let count = 0;
    //Storing the data from the request body
    productOffers = req.body.productOffers;
    productOffers.forEach((productOffer,index,productOffers) => {
        //Getting the product by its ID
        product.getProductById(productOffer['productId'])
        .then(productResult => {
        //If no product was found with that id, the error will be added to the error array
        if(productResult == null)
        {
            //Adding error
            count++;
            errors[productOffer['productId']] = "No such product witht that ID";
            //If this is the last element of the array, then retrun a successful
            if(index  === productOffers.length - 1)            
                return res.status(200).send({
                    message:"Processed offers successfuly with "+count+" errors",
                    errors:errors
                });
        }
        //If the product was found, tehn proceed
        else
        {
            //Calculating the newprice, then validating the offer data
            newPrice = productResult.price - (productResult.price*(productOffer['discountRate']/100));
            const offerValidationResult = offer.validateOfferInfo({discountRate:productOffer['discountRate'],
                                                                    duration:productOffer['duration'],
                                                                    newPrice:newPrice});
            //If error was found in the data, then add it to the array
            if(typeof offerValidationResult !== 'undefined')
            {
                //Adding error
                count++;
                errors[productResult._id] = offerValidationResult.error;
                //If this is the last element of the array, then retrun a successful response
                if(index  === productOffers.length - 1)            
                   return res.status(200).send({
                        message:"Processed offers successfuly with "+count+" errors",
                        errors:errors
                    });
            }
            //If no error was found, then proceed to create the offer
            else
            {           
                //Creating offer
                offer.createOffer(productOffer['discountRate'],productOffer['duration'],newPrice)
                .then(offerResult => {
                //Adding the offer to the product
                product.addOffer(productOffer['productId'],offerResult)
                    .then(updatedProductResult => {
                        //If this is the last element of the array, then retrun a successful response
                        if(index  === productOffers.length - 1)            
                            return res.status(200).send({
                                message:"Processed offers successfuly with "+count+" errors",
                                errors:errors
                            });
                    })
                    //If adding the offer to the product runs into error, then return an error response
                    .catch(err => {
                        offer.deleteOffer(offerResult._id);
                        //Adding error
                        count++;
                        errors[productResult._id] = "Errors with adding offer to product. "+err;
                        //If this is the last element of the array, then retrun a successful response
                        if(index  === productOffers.length - 1)            
                            return res.status(200).send({
                                message:"Processed offers successfuly with "+count+" errors",
                               errors:errors
                            });
                    });
                })
                //If creating the offer runs into error, then return an error response
                .catch(err => {
                    //Adding error
                    count++;
                    errors[productResult._id] = "Errors with creating offer. "+err;
                    //If this is the last element of the array, then retrun a successful response
                    if(index  === productOffers.length - 1)            
                        return res.status(200).send({
                            message:"Processed offers successfuly with "+count+" errors",
                            errors:errors
                        });
                });
            }
        }
        })
        //If getting the product runs into error, then return an error response
        .catch(err => {
            //Adding error
            count++;
            errors[productOffer['productId']] = "Errors with getting product. "+err;
            //If this is the last element of the array, then retrun a successful response
            if(index  === productOffers.length - 1)            
               return res.status(200).send({
                        message:"Processed offers successfuly with "+count+" errors",
                        errors:errors
                    });
        });
    });//End of foreach 
    })
    //If getting the store runs into error, then return an error response
    .catch(err => {return res.status(500).send({error:"Error getting store with that id.    "+err})});
});
//----------delete Offer----------
router.delete('/stores/:storeId/offers/delete-offer/:offerId',userAuthenticated,(req,res) => {
    //Getting and checking if the logged user is an authorized one, if not then return error response
    loggedUser = req.user;
    if(loggedUser.role !== "garageOwner")
        return res.status(401).send({error:"Unauthorized user !"})
    //Checking if the provided storeId exists
    storeId = req.params.storeId;
    store.exists(storeId)
    .then(getStoreResult => {
    //If it doesn't exist, return error response
    if(!getStoreResult)
        return res.status(404).send({error:"Error! Didn't find store with that id."});
    //Checking if the store actually belongs to the current logged user
    //If it doesn't, return error response
    else if(getStoreResult.userId != loggedUser._id)
        return res.status(401).send({error:"Error! The requested store doesn't belong to this garage owner."});
    //Checking if the provided offerId exists
    offerId = req.params.offerId;
    offer.exists(offerId)
        .then(getOfferResult => {
        //If it doesn't exist, return error response
        if(!getOfferResult)
            return res.status(404).send({error:"Error! Didn't find offer with that id."});

        //Removing the offer from the product
        product.removeOffer(offerId)
            .then(productResult => {
            //Deleting the offer
            offer.deleteOffer(offerId)
                .then(offerResult => {
                    //Returning a successful response
                    return res.status(200).send({success:true});
                })
                //If deleting the offer runs into error, then return an error response
                .catch(err => {return res.status(500).send({error:"Error with deleting offer. "+err})});
            })
            //If removing the offer from the product runs into error, then return an error response
            .catch(err => {return res.status(500).send({error:"Error with removing offer from the product. "+err})});
        })
        //If getting the offer runs into error, then return an error response
        .catch(err => {return res.status(500).send({error:"Error with getting offer id. "+err})});
    })
    //If getting the store runs into error, then return an error response
    .catch(err => {return res.status(500).send({error:"Error getting store with that id.    "+err})});
});
//Exporting the route
module.exports = router;
