const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Subscription = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    endpoint: {
        type: String,                
    },

    expirationTime: {
        type: Date,
        default: null
    },

    keys: {
        auth: {
            type: String
        },

        p256dh: {
            type: String
        }
    }
});

module.exports = Subscription;