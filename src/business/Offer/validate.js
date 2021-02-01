//Requiring the validation package
const validator = require('validator');
//Exporting the validation method
module.exports = {
    //A method to validate the offer information
   validateOfferInfo(offer)
    {
        if(offer.discountRate !== undefined)
        {
            if(validator.matches(offer.discountRate.toString(),/(^[\d]{1,3}$)/))
            {
                if(offer.discountRate > 100 || offer.discountRate < 0)
                    return "Invalid offer discountRate !";
            }
            else
                return "Invalid offer discountRate !";
        }   
        else
            return "Invalid offer discountRate !";
        

        if(offer.duration === undefined || !validator.matches(offer.duration.toString(),/(^[\d]{1,3}$)/))
           return "Invalid offer duration !";
        if(offer.newPrice === undefined || !validator.matches(offer.newPrice.toString(),/(^[\d\.]+$)/))
            return "Invalid offer newPrice !";
        
        return "pass";
    }
}