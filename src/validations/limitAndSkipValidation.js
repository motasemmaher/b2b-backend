const validator = require('validator');

module.exports = {
    validateLimitAndSkip(limit, skip) {
        if (!validator.matches(limit, /^\d+$/))
            return "limit must exists and be a number";
        if (!validator.matches(skip, /^\d+$/))
            return "skip must exists and be a number";
        return "pass";
    }
}