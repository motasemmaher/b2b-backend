const validator = require('validator');

module.exports = {
    
   validateProductInfo(product)
   {
    if(!validator.matches(product.name,/(^[A-Z a-z \s\d-']{4,64}$)/))
           return "invalid product name";
    if(!validator.matches(product.description,/(^[A-Z a-z \s\d-'\.]{8,254}$)/))
           return "invalid product description";
    if(!validator.matches(product.price,/(^[\d\.]+$)/))
        return "invalid product price";
    return "pass";
   }
}