const mongoose = require('mongoose')
const MessageSchema = require("../schema/Message");

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports =
{

    createMessage(value)
    {
        const result = MessageModel.create({owner:value.userId,data:value.messageBody});
        if(result)
            return result;
        else
            return {error:"Error with the creation Message"};
    }
    ,
    //FOR TESTING
    deleteMessage(value)
    {
        const result = MessageModel.findOneAndDelete({_id:value._id});
        if(result)
            return result;
        else
            return {error:"Error with the deletion Message"};
    }

}