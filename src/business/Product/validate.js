//Requiring the validation package
const validator = require('validator');
//Exporting the validation method
module.exports = {
       //A method to validate the product information
       validateProductInfo(product)
       {
       if(product.name === undefined || !validator.matches(product.name,/(^[\p{L}\s\d'-]{4,64}$)/ugi))
              return "Invalid product name !";
       if(product.description === undefined || !validator.matches(product.description,/(^[\p{L}\s\d',\.-]{8,254}$)/ugi))  
              return "Invalid product description !";
       if(product.price === undefined || !validator.matches(product.price.toString(),/(^[\d\.]+$)/))
              return "Invalid product price !";
       if(product.tags === undefined || !validator.matches(product.tags,/(^[\p{L}\s\d',-]{2,256}$)/ugi))
              return "Invalid category tags !";   
       if(product.productType === undefined || !["Part", "Accessory", "Service"].includes(product.productType))  
              return "Invalid product type !";
       if(product.generalType === undefined || !validator.matches(product.generalType,/(^[\p{L}\s\d'-]{4,64}$)/ugi))  
              return "Invalid product general type !";


       return "pass";
       }
}