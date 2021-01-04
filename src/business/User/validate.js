const validator = require('validator');

module.exports = {

    validateUserInfo(user)
    {
        if(!validator.matches(user.fullName,/(^[A-Z a-z \s]{3,64}$)/))
            return "Invalid user fullname !";
        if(!validator.matches(user.username,/(^[A-Z a-z \d_]{8,64}$)/))
            return "Invalid username !";
        if(!validator.isEmail(user.email))
            return "Invalid email !";
        if(!validator.matches(user.phoneNumber,/(^[0][7][789]\d{7}$)/))
            return "Invalid phone number !";
        if(!validator.matches(user.password,/(.{8,64})/))
            return "Invalid password !";
        if(!validator.matches(user.address,/(^[A-Z a-z ' -]{5,8}$)/))
            return "Invalid user address !";
        if(!["admin", "garageOwner", "carOwner", "waitingUser"].includes(user.role))  
            return "Invalid user role !";

        return "pass";
    }
    
}