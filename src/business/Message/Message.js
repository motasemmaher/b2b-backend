const MessageModel = require('../../models/model/Message')

module.exports = class Message
{
    constructor () {}

    createMessage(userId,messageBody)
    {
        const messagePromise = MessageModel.createMessage({userId:userId,messageBody,messageBody});
        return messagePromise;
    }

}
