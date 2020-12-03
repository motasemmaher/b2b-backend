const validator = require('validator');

module.exports = {
    
   validateCategoryInfo(category)
   {
    if(!validator.matches(category.name,/(^[A-Z a-z\s-_']{4,64}$)/))
           return "invalid category name";
    return "pass";
   }
}