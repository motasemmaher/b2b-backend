const validator = require('validator');

module.exports = {
    
   validateProductInfo(product)
   {
       if(!validator.matches(product.name,/(^[A-Z a-z \s\d-']{4,64}$)/))
              return "Invalid product name !";
       if(!validator.matches(product.description,/(^[A-Z a-z \s\d-'\.]{8,254}$)/))  
              return "Invalid product description !";
       if(!validator.matches(product.price,/(^[\d\.]+$)/))
              return "Invalid product price !";
       if(!validator.matches(product.tags,/(^[A-Z a-z\s\d-,']{2,256}$)/))
              return "Invalid category tags !";   
       if(!["Part", "Accessory", "Service"].includes(product.productType))  
              return "Invalid product type !";

       return "pass";
   }
       
   
}