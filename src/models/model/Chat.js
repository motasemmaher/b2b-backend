const mongoose = require('mongoose')
const ChatSchema = require("../schema/Chat");

const ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = {

    createChat(value) {
        const result = ChatModel.create(value);

        if (result)
            return result;
        else
            return {
                error: "Error with the creation Chat"
            };
    },

    getChat(value) {
        const result = ChatModel.findOne({
            contactBetween: value.contactBetween
        });
        if (result)
            return result;
        else
            return {
                error: "Error in getChat function"
            };
    },

    pushMessage(value) {
        const result = ChatModel.findOneAndUpdate({
            contactBetween: value.contactBetween
        }, {
            $push: {
                messages: value.message
            }
        });
        if (result)
            return result;
        else
            return {
                error: "Error in pushMessage function"
            };
    }

}