const OfferModel = require('../../models/model/Offer');

module.exports = class Offer{ 
    
    constructor ()
    {}

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