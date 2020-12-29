const validator = require('validator');

module.exports = {
    
   validateCategoryInfo(category)
   {
      if(!validator.matches(category.name,/(^[A-Z a-z\s\d-_']{2,64}$)/))
         return "Invalid category name !";
      // if(!validator.matches(category.tags,/(^[A-Z a-z\s\d-,']{2,256}$)/))
      //    return "Invalid category tags !"   

       return "pass";
   }
}