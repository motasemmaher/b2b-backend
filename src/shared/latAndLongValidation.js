//Requiring the validation package
const validator = require('validator');

//----------Checking lat and long password----------
//Exporting the validation method
module.exports = {
    //A method to validate the values of the latitude and longitude
    validatingLatAndLong(lat,long)
    {
        if(lat === undefined || !validator.matches(lat+"",/(^(\d+).(\d+)$)/))
            return {error: "Invalid store latitude !"};            
        if(long === undefined || !validator.matches(long+"",/(^(\d+).(\d+)$)/))
            return {error: "Invalid store longitude !"};
        return "pass";
    }
}