//Requiring the validation package
const validator = require('validator');
//Exporting the validation method
module.exports = {
   //A method to validate the warehouse information
   validateWarehouseInfo(warehouse)
   {
      if(warehouse.amount === undefined || !validator.matches(warehouse.amount.toString(),/(^[\d]{1,4}$)/))
         return "Invalid warehouse's product amount !";

      return "pass";
   }
}