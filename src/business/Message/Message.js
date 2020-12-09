const MessageModel = require('../../models/model/Message')
const MessageValidation = require('./validate');
module.exports = class Message
{
    constructor () {}

    validateMessageInfo(message)
    {
        const validationResult = MessageValidation.validateMessageInfo(message);
        if(validationResult !== "pass")
            return {err:"Error: "+validationResult};
    }

    createMessage(userId,messageBody)
    {
        const messagePromise = MessageModel.createMessage({userId:userId,messageBody,messageBody});
        return messagePromise;
    }
}
