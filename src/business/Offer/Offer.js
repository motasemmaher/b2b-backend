const OfferModel = require('../../models/model/Offer');
const OfferValidation = require('./validate');
module.exports = class Offer{ 
    
    constructor ()
    {}

    validateOfferInfo(offer)
    {
        console.log("Inside offer");
        console.log("discount: "+offer.discountRate);
        console.log("duration: "+offer.duration);
        console.log("new price: "+offer.newPrice);
        //console.log("exiration: "+offer.expirationDate);

        const validationResult = OfferValidation.validateOfferInfo(offer);
        if(validationResult !== "pass")
            return {err:"Error: "+validationResult};
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

}