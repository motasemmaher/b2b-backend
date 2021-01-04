const validator = require('validator');

module.exports = {
    
   validateCarInfo(car)
    {
        if(!validator.matches(car.make,/(^[A-Z a-z \s\d-']{3,24}$)/))
            return "Invalid car make !";    
        if(!validator.matches(car.model,/(^[A-Z a-z \d ']{2,24}$)/))
            return "Invalid car model !";

        if(validator.matches(car.year,/(^[\d']{4}$)/))
        {
            if(parseInt(car.year) < 1885 || parseInt(car.year) > new Date(). getFullYear()+1)
                return "Invalid car year !";
        }
        else
            return "Invalid car year !";

        return "pass";
    }

}