//Requiring the validation package
const validator = require('validator');
//Exporting the validation method
module.exports = {

    validateUserInfo(user, isPasswordExists) {
        if (!user.fullName || !validator.matches(user.fullName, /(^[\p{L}\s]{3,64}$)/ugi))
            return "Invalid user fullname !";
        if (!user.username || !validator.matches(user.username, /(^[\p{L}\d_]{8,64}$)/ugi))
            return "Invalid user username !";
        if (!user.email || !validator.isEmail(user.email))
            return "Invalid user email !";
        if (!user.phoneNumber || !validator.matches(user.phoneNumber, /(^[0][7][789]\d{7}$)/))
            return "Invalid user phone number !";
        if (isPasswordExists && (!user.password || !validator.matches(user.password, /(^.{8,64}$)/)))
            return "Invalid user password !";
        if (!user.address || !validator.matches(user.address, /(^[\p{L}'-]{4,9}$)/ugi))
            return "Invalid user address !";
        if (!user.role || !["admin", "garageOwner", "carOwner", "waitingUser"].includes(user.role))
            return "Invalid user role !";

        return "pass";
    }

}