//Requiring the validation package
const validator = require('validator');
//Exporting the validation method
module.exports = {
    //A method to validate the user information
    validateUserInfo(user)
    {
        if(user.fullName === undefined || !validator.matches(user.fullName,/(^[\p{L}\s]{3,64}$)/ugi))
            return "Invalid user fullname !";
        if(user.username === undefined || !validator.matches(user.username,/(^[\p{L}\d_]{8,64}$)/ugi))
            return "Invalid user username !";
        if(user.email === undefined || !validator.isEmail(user.email))
            return "Invalid user email !";
        if(user.phoneNumber === undefined || !validator.matches(user.phoneNumber,/(^[0][7][789]\d{7}$)/))
            return "Invalid user phone number !";
        if(user.password === undefined || !validator.matches(user.password,/(^.{8,64}$)/))
            return "Invalid user password !";
        if(user.address === undefined || !validator.matches(user.address,/(^[\p{L}'-]{4,9}$)/ugi))
            return "Invalid user address !";
        if(user.role === undefined || !["admin", "garageOwner", "carOwner", "waitingUser"].includes(user.role))  
            return "Invalid user role !";

        return "pass";
    }
    
}