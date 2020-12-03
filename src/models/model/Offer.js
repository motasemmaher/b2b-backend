const mongoose = require('mongoose')
const OfferSchema = require('../schema/Offer');
const moment = require('moment');
//const { addDays } = require('date-and-time');

const OfferModel = mongoose.model('Offer', OfferSchema);

addDays = function(days)
{
        let date = new Date();
        date.setDate(date.getDate() + days);
        return date;  
};


module.exports = 
{
    createOffer(value)
    {
        //expirationDate = moment().add(value.duration,'days').format('DD/MM/YYYY');
        //expirationDate = moment().add(value.duration,'days');
        expirationDate = addDays(value.duration);
        console.log(expirationDate);
        const result = OfferModel.create({discountRate:value.discountRate,duration:value.duration,newPrice:value.newPrice,expirationDate:expirationDate});
        if(result)
        return result;
        else
        return {error:"Error with the creation Offer"};
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