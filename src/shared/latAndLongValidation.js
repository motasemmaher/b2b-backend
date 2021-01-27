const validator = require('validator');

//----------Checking lat and long password----------
module.exports = {
    validatingLatAndLong(lat,long)
    {
        if(lat === undefined || !validator.matches(lat+"",/(^(\d+).(\d+)$)/))
            return {error: "Invalid store latitude !"};            
        if(long === undefined || !validator.matches(long+"",/(^(\d+).(\d+)$)/))
            return {error: "Invalid store longitude !"};
        return "pass";
    }
}