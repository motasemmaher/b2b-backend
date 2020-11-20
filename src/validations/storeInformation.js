const validator = require('validator');

module.exports = {
    
   validateStoreInfo(store)
   {
       if(!validator.matches(store.storeName,/(^[A-Z a-z \d\s-_']{4,64}$)/))
           return "invalid store name";
       /*
           Address validations
       */
       if(!validator.matches(store.description,/(^[A-Z a-z \d\s-_.']{8,254}$)/))
           return "invalid store description";
       return "pass";
   }

}