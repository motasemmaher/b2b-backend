const validator = require('validator');

module.exports = {
    
   validateMessageInfo(message)
    {
        if(!validator.matches(message.data,/(^[A-Z a-z\s\d-,\.']{2,512}$)/))
            return "Invalid message data !";
 
        return "pass";
    }
}