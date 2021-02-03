//Requiring the necessary files and models
const MessageModel = require('../../models/model/Message')
const MessageValidation = require('./validate');
//Exporting the class
module.exports = class Message
{
    constructor () {}
    //A method to validate the message information
    validateMessageInfo(message)
    {
        const validationResult = MessageValidation.validateMessageInfo(message);
        if(validationResult !== "pass")
            return {error:"Error: "+validationResult};
    }
    //A method to create message
    createMessage(userId,messageBody)
    {
        const promiseResult = MessageModel.createMessage({userId:userId,messageBody:messageBody});
        return promiseResult;
    }
    //A method to delete message
    deleteMessage(messageId)
    {
        const promiseResult = MessageModel.deleteMessage({_id:messageId});
        return promiseResult;
    }
}
