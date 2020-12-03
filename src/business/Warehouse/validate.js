const validator = require('validator');

module.exports = {
    
   validateWarehouseInfo(warehouse)
   {
    if(!validator.matches(warehouse.amount,/(^[\d]{1,4}$)/))
           return "invalid warehouse'sproduct amount";
    return "pass";
   }
}