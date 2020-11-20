const mongoose = require('mongoose');

const schema = mongoose.Schema;

const User = new schema({

    fullName: {
        type: String,
        minLength: 8,
        maxlength: 64,
        required: true,
        trim: true
    },

    username: {
        type: String,
        require: true,
        unique: true,
        minLength: 8,
        maxlength: 64
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },

    password: {
        type: String,
        required: true,
        minLength: 8,
        maxlength: 64
    },

    phoneNumber: {
        type: String,
        require: true,
        unique: true,
        minLength: 10,
        maxlength: 10
    },

    address: {
        type: String,
        require: true
    },

    role: {
        type: String,
        require: true,
        enum: ["admin", "garageOwner", "carOwner", "waitingUser"]
    }

});


module.exports = User;
