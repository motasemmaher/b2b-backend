const ChatModel = require('../../models/model/Chat');

module.exports = class Chat {
    createChat(chatInfo) {
        const result = ChatModel.createChat(chatInfo);
        return result;
    }

    getChat(contactBetween) {
        const result = ChatModel.getChat({
            contactBetween
        });
        return result;
    }

    pushMessage(contactBetween, message) {
        const result = ChatModel.pushMessage({
            contactBetween: contactBetween,
            message: message
        });
        return result;
    }
};