const validator = require('validator');

module.exports = {
    
   validateWarehouseInfo(warehouse)
   {
      if(!validator.matches(warehouse.amount+"",/(^[\d]{1,4}$)/))
         return "Invalid warehouse's product amount !";

      return "pass";
   }
}