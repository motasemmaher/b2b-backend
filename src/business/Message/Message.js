const MessageModel = require('../../models/model/Message')
const MessageValidation = require('./validate');
module.exports = class Message
{
    constructor () {}

    validateMessageInfo(message)
    {
        const validationResult = MessageValidation.validateMessageInfo(message);
        if(validationResult !== "pass")
            return {error:"Error: "+validationResult};
    }

    createMessage(userId,messageBody)
    {
        const promiseResult = MessageModel.createMessage({userId:userId,messageBody:messageBody});
        return promiseResult;
    }

    deleteMessage(messageId)
    {
        const promiseResult = MessageModel.deleteMessage({_id:messageId});
        return promiseResult;
    }
}
