const validator = require('validator');

module.exports = {
    
   validateMessageInfo(message)
    {
        if(message.data === undefined || !validator.matches(message.data,/(^[\p{L}\s\d,\.'-]{2,512}$)/ugi))
            return "Invalid message data !";
 
        return "pass";
    }
}