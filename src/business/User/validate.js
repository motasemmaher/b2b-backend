const validator = require('validator');

module.exports = {

    validateUserInfo(user)
    {
        if(!validator.matches(user.username,/(^[A-Z a-z \d_]{8,64}$)/))
            return "invalid username";
        if(!validator.matches(user.password,/(.{8,64})/))
            return "invalid password";
        if(!validator.matches(user.fullName,/(^[A-Z a-z \s_]{8,64}$)/))
            return "invalid fullname";
        if(!validator.isEmail(user.email))
            return "invalid email";
        if(!validator.matches(user.phoneNumber,/(^[0][7][789]\d{7}$)/))
            return "invalid phonenumber";
        /*
            Address validation
        */
        return "pass";
    }
    
}