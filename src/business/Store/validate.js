const validator = require('validator');

module.exports = {
    
   validateStoreInfo(store)
    {
        if(store.name === undefined || !validator.matches(store.name,/(^[\p{L} \d\s_'-]{4,64}$)/ugi))
            return "Invalid store name !";
        if(store.address === undefined || !validator.matches(store.address,/(^[\p{L}'-]{4,8}$)/ugi))
            return "Invalid store address !";
        if(store.description === undefined || !validator.matches(store.description,/(^[\p{L}\d\s_\.'-]{8,512}$)/ugi))
            return "Invalid store description !";
        if(store.openTime === undefined || !validator.matches(store.openTime,/^(1[0-2]|0?[1-9]):([0-5]?[0-9]) [A-P]M$/))
            return "Invalid store open time !";
        if(store.closeTime === undefined || !validator.matches(store.closeTime,/^(1[0-2]|0?[1-9]):([0-5]?[0-9]) [A-P]M$/))
            return "Invalid store close time !";
        if(store.tags === undefined || !validator.matches(store.tags,/(^[\p{L}\s\d',-]{2,256}$)/ugi))
            return "Invalid store tags !";
        
        return "pass";
    }
}