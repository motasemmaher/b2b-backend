//Requiring the validation package
const validator = require('validator');
//Exporting the method
module.exports = {
   //A method to validate the car information
   validateCategoryInfo(category)
   {
      if(category.name === undefined || !validator.matches(category.name,/(^[\p{L}\s\d'_-]{2,64}$)/ugi))
         return "Invalid category name !";
      if(category.tags === undefined || !validator.matches(category.tags,/(^[\p{L}\s\d',-]{2,256}$)/ugi))
         return "Invalid category tags !"   

       return "pass";
   }
}