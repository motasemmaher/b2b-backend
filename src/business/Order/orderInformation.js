const validator = require('validator');

module.exports = {

    validateOrderInfo(orderInfo) {
        if (!validator.matches(orderInfo.phoneNumber, /(^[0][7][789]\d{7}$)/))
            return "invalid phonenumber";
        // if (!validator.matches(orderInfo.deliveryAddress, /[\p{L}\s+\d]/ugi))
        //     return "invalid phonenumber";
        return "pass";
    }

}