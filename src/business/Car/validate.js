const validator = require('validator');

module.exports = {
    
   validateCarInfo(car)
    {
        if(!validator.matches(car.make,/(^[A-Z a-z \s\d-']{3,24}$)/))
            return "Invalid car make !";    
        if(!validator.matches(car.model,/(^[A-Z a-z']{2,24}$)/))
            return "Invalid car model !";
        if(!validator.matches(car.year,/(^[\d']{4}$)/))
            if(car.year < 1885 || car.year > new Date(). getFullYear())
                return "Invalid car year !";
                
        return "pass";
    }

}