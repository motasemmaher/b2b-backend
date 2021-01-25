const mongoose = require('mongoose')

const schema = mongoose.Schema;

const Chat = new schema({
    contactBetween: {
        type: String,
        require: true,
        unique: true
    },
    messages: [{
        text: {
            require: true,
            type: String,
            // uique: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        // files: [],
        // type: String,
        reply: String,
        user: {
            name: String,
            // avatar: String,
            receiver: String,
            sender: String
        }
    }],

})


module.exports = Chat;