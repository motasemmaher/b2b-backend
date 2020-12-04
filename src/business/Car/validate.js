const validator = require('validator');

module.exports = {
    
   validateCarInfo(car)
   {
       if(!validator.matches(car.model,/(^[A-Z a-z']{4,64}$)/))
           return "invalid car model";
       if(!validator.matches(car.make,/(^[A-Z a-z \s\d-']{4,64}$)/))
           return "invalid car make";
       if(!validator.matches(car.year,/(^[\d']{4}$)/))
           if(car.year < 1885 || car.year > new Date(). getFullYear())
           return "invalid car year";
       return "pass";
   }

}