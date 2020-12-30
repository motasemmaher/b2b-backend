const validator = require('validator');

module.exports = {
    
   validateOfferInfo(offer)
    {
        if(!validator.matches(offer.discountRate.toString(),/(^[\d]{1,3}$)/))
            if(discountRate > 100)
                return "Invalid offer discountRate !";
        if(!validator.matches(offer.duration.toString(),/(^[\d]{1,3}$)/))
           return "Invalid offer duration !";
        if(!validator.matches(offer.newPrice.toString(),/(^[\d\.]+$)/))
            return "Invalid offer newPrice !";
        
        return "pass";
    }
}