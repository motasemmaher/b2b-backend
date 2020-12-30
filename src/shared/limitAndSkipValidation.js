const validator = require('validator');

module.exports = {
    validateLimitAndSkip(limit, skip) {
        if(limit === null && skip === null)
            return "default both";
        if (limit === undefined || limit === null || !validator.matches(limit, /^\d+$/))
            return "default limit";            
        if (skip === undefined || skip === null || !validator.matches(skip, /^\d+$/))
            return "default skip";
        return "pass";
    }
    ,
    limitAndSkipValues(limit, skip) 
    {    
        const validationResult = this.validateLimitAndSkip(limit, skip);   
        
        if(validationResult === "default both")
            return {limit: 30, skip: 0}                            
        else if(validationResult === "default limit") 
        {            
            skip = parseInt(skip);
            if(skip < 0)
                skip = 0;
            return {limit: 30, skip}
        }
        else if(validationResult === "default skip") 
        {
            limit = parseInt(limit);
            if(limit <= 0) 
                limit = 30;            
            return {limit, skip: 0}
        }
        return {limit: parseInt(limit), skip: parseInt(skip)};
    }
}