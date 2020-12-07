const validator = require('validator');

module.exports = {
    
   validateStoreInfo(store)
   {
       try{
       console.log("Storename: "+store.storeName);
       console.log("Description: "+store.description);

       if(!validator.matches(store.storeName,/(^[A-Z a-z \d\s-_']{4,64}$)/))
           return "invalid store name";
       /*
           Address validations
       */
       if(!validator.matches(store.description,/(^[A-Z a-z \d\s-_.']{8,254}$)/))
           return "invalid store description";
       return "pass";
       }
       catch(err)
       {
        return "Store Information Error: "+err;
       }
   }

}