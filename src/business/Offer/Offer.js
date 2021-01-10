const OfferModel = require('../../models/model/Offer');
const OfferValidation = require('./validate');
const schedule = require('node-schedule');

const Product = require('../Product/Product');
const product = new Product();
module.exports = class Offer{ 
    
    constructor () {}

    validateOfferInfo(offer)
    {
        const validationResult = OfferValidation.validateOfferInfo(offer);
        if(validationResult !== "pass")
            return {error:"Error: "+validationResult};
    }

    exists(offerId)
    {
        const promiseResult = OfferModel.exists({offerId:offerId});
        return promiseResult;
    }

    createOffer(discountRate,duration,newPrice)
    {
        const promiseResult = OfferModel.createOffer({discountRate:discountRate,duration:duration,newPrice:newPrice});
        return promiseResult;
    }

    deleteOffer(offerId)
    {
        const promiseResult = OfferModel.deleteOffer({_id:offerId});
        return promiseResult;
    }
/*
    removeExpiredOffers()
    {
        //----------Clear Offers----------
        const checkOffers = schedule.scheduleJob('0 * * * *', () => {
            console.log("CHECKING OFFERS");
            product.expiredOffers()
            .then(productsResult => {
            productsResult.forEach(record => {
                if(record.offer == null)
                    return;
                else
                {
                    this.deleteOffer(record.offer._id)
                    .then(offerResult => {
                    product.removeOffer(offerResult._id)
                        .then(productResult => {
                        console.log("Deleted an offer");
                        return;
                        })
                        .catch(err => console.log("Error with removing offer from product. "+err));
                    })
                    .catch(err => console.log("Error with deleting offer. "+err));
                }
            });
            console.log("Removed all expired offers");
            })
            .catch(err => console.log("Error with getting expired offers. "+err));
        });
    }
    */
}