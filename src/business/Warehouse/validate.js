const validator = require('validator');

module.exports = {
    
   validateWarehouseInfo(warehouse)
   {
      if(warehouse.amount === undefined || !validator.matches(warehouse.amount.toString(),/(^[\d]{1,4}$)/))
         return "Invalid warehouse's product amount !";

      return "pass";
   }
}