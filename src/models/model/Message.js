const mongoose = require('mongoose')
const MessageSchema = require("../schema/Message");
const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = class Message
{
    static createMessage(res,value)
    {
        console.log(value);
        MessageModel.create({owner:value.owner,data:value.data})
                    .then(result => res.send("Created Message"))
                    .catch(err => res.send("Error with the creation Message"));
    }

    /*
    static updateMessage(value)
    {
        MessageModel.findOneAndUpdate(
                {_id:value._id},
                {owner:value.userId,data:value.data,date:Date.now}, {"useFindAndModify":false}
                )
                .then(result => console.log("Updated Message"))
                .catch(err => console.log("Error with the update Message"));
    }

    static deleteMessage(value)
    {
        MessageModel.findOneAndDelete({_id:value._id})
                .then(result => console.log("Deleted Message"))
                .catch(err => console.log("Error with the deletion Message"));
    }
    */
}