const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Perminssions = new schema({
    
    role: {
        type: String,
        unique: true,
        enum: ["admin", "garageOwner", "carOwner", "waitingUser"]
    },

    perminssions: [{
        type: String
    }]
});

module.exports = Perminssions;