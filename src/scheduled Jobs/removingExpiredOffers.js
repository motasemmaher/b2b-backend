//Requiring the necessary packages
const schedule = require('node-schedule');
//Requiring the necessary objects
const offer = require('../business/Objects').OFFER;
const product = require('../business/Objects').PRODUCT;

module.exports = {
    removeExpiredOffers()
    {
        //----------Clear Offers----------
        const checkOffers = schedule.scheduleJob('0 * * * *', () => {
        //const checkOffers = schedule.scheduleJob('* * * * *', () => {
            console.log("CHECKING OFFERS");
            //Getting expire offers
            product.expiredOffers()
            .then(productsResult => {
            productsResult.forEach(record => {
                if(record.offer == null)
                    return;
                else
                {
                    //Deleting offer
                    offer.deleteOffer(record.offer._id)
                    .then(offerResult => {
                    //Removing offer from the product
                    product.removeOffer(record.offer._id)
                        .then(productResult => {
                        console.log("Deleted an offer");
                        return;
                        })
                        //If removing the offer from the product runs into error, then console an error log
                        .catch(err => console.log("Error with removing offer from product. "+err));
                    })
                    //If deleting the offer runs into error, then console an error log
                    .catch(err => console.log("Error with deleting offer. "+err));
                }
            });
            //Finished looping
            console.log("Removed all expired offers");
            })
            //If getting the xpired offers runs into error, then console an error log
            .catch(err => console.log("Error with getting expired offers. "+err));
        });
    }
}
    