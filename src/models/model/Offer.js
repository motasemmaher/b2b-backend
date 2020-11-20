const mongoose = require('mongoose')
const OfferSchema = require('../schema/Offer');

const OfferModel = mongoose.model('Offer', OfferSchema);

module.exports = 
{

    createOffer(value)
    {
        const result = OfferModel.create({discountRate:value.discountRate,duration:value.duration});
        if(result)
        return result;
        else
        return {error:"Error with the creation Offer"};
    }
    ,
    updateOffer(value)
    {
        const result = OfferModel.findOneAndUpdate(
                {_id:value._id},
                {discountRate:value.discountRate,duration:value.duration}, {"useFindAndModify":false}
                );
        if(result)
            return result;
        else
            return {error:"Error with the update Offer"};
    }
    ,
    deleteOffer(value)
    {
        const result = OfferModel.findOneAndDelete({_id:value._id});
        if(result)
        return result;
        else
        return {error:"Error with the deletion Offer"};
    }

}