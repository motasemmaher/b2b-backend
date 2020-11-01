const mongoose = require('mongoose')
const OfferSchema = require('../schema/Offer');
const OfferModel = mongoose.model('Offer', OfferSchema);

module.exports = class Offer
{

    static createOffer(res,value)
    {
        console.log(value);
        OfferModel.create({discountRate:value.discountRate,duration:value.duration})
                  .then(result => res.send("Created Offer"))
                  .catch(err => res.send("Error with the creation Offer"));
    }

    static updateOffer(res,value)
    {
        OfferModel.findOneAndUpdate(
                {_id:value._id},
                {discountRate:value.discountRate,duration:value.duration}, {"useFindAndModify":false}
                )
                .then(result => res.send("Updated Offer"))
                .catch(err => res.send("Error with the update Offer"));
    }

    static deleteOffer(res,value)
    {
        OfferModel.findOneAndDelete({_id:value._id})
                  .then(result => res.send("Deleted Offer"))
                  .catch(err => res.send("Error with the deletion Offer"));
    }

}