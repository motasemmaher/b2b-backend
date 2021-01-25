const validator = require('validator');

module.exports = {
    
   validateCarInfo(car)
    {
        //if(!validator.matches(car.make,/(^[A-Z a-z \s\d'-]{3,24}$)/))
        if(car.make === undefined || !validator.matches(car.make,/(^[\p{L} \s\d'-]{3,24}$)/ugi))
        return "Invalid car make !";    
        if(car.model === undefined || !validator.matches(car.model,/(^[\p{L} \d'-]{2,24}$)/ugi))
            return "Invalid car model !";

        if(car.year !== undefined)
        {
            if(validator.matches(car.year,/(^[\d']{4}$)/))
            {
                if(parseInt(car.year) < 1885 || parseInt(car.year) > new Date(). getFullYear()+1)
                return "Invalid car year !";
            }
            else
            return "Invalid car year !";
        }  
        else
            return "Invalid car year !";
        

        return "pass";
    }

}