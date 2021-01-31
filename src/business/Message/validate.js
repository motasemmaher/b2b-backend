//Requiring the validation package
const validator = require('validator');
//Exporting the validation method
module.exports = {
    //A method to validate the message information
    validateMessageInfo(message)
    {
        if(message.data === undefined || !validator.matches(message.data,/(^[\p{L}\s\d,\.'-]{2,512}$)/ugi))
            return "Invalid message data !";
 
        return "pass";
    }
}