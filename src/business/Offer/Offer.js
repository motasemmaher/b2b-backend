//Requiring the necessary files and models
const OfferModel = require('../../models/model/Offer');
const OfferValidation = require('./validate');
//Exporting the class
module.exports = class Offer{ 
    
    constructor () {}
    //A method to validate the offer information
    validateOfferInfo(offer)
    {
        const validationResult = OfferValidation.validateOfferInfo(offer);
        if(validationResult !== "pass")
            return {error:"Error: "+validationResult};
    }
    //A method to check if the offer exist in the database by using its ID
    exists(offerId)
    {
        const promiseResult = OfferModel.exists({offerId:offerId});
        return promiseResult;
    }
    //A method to create offer
    createOffer(discountRate,duration,newPrice)
    {
        const promiseResult = OfferModel.createOffer({discountRate:discountRate,duration:duration,newPrice:newPrice});
        return promiseResult;
    }
    //A method to delete offer
    deleteOffer(offerId)
    {
        const promiseResult = OfferModel.deleteOffer({_id:offerId});
        return promiseResult;
    }
}

