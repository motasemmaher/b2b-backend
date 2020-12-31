const validator = require('validator');

module.exports = {

    validateCartItemInfo(cartItemInfo) {
        if (!validator.matches(cartItemInfo.quantity, /^\d+$/))
            return "invalid quantity must be a number";
        return "pass";
    }

}