const validator = require('validator');

module.exports = {
    
   validateStoreInfo(store)
    {
        if(!validator.matches(store.name,/(^[A-Z a-z \d\s-_']{4,64}$)/))
            return "Invalid store name !";
        if(!validator.matches(store.address,/(^[A-Z a-z ' -]{5,8}$)/))
            return "Invalid store address !";
        if(!validator.matches(store.description,/(^[A-Z a-z \d\s-_.']{8,512}$)/))
            return "invalid store description";
        if(!validator.matches(store.openTime,/^(1[0-2]|0?[1-9]):([0-5]?[0-9]) [A-P]M$/))
            return "Invalid store open time !";
        if(!validator.matches(store.closeTime,/^(1[0-2]|0?[1-9]):([0-5]?[0-9]) [A-P]M$/))
            return "Invalid store close time !";
        if(!validator.matches(store.tags,/(^[A-Z a-z\s\d-,']{2,256}$)/))
            return "Invalid store tags !";
        
        return "pass";
    }
}