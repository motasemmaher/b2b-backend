const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Permissions = new schema({
    
    role: {
        type: String,
        unique: true,
        enum: ["admin", "garageOwner", "carOwner", "waitingUser"]
    },

    permissions: [{
        type: String
    }]
});

module.exports = Permissions;