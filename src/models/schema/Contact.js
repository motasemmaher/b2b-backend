const mongoose = require('mongoose')

const User = require('./User');

const schema = mongoose.Schema;

const Contact = new schema({
    ownerId: {
        type: String,
        require: true,        
        unique: true
    },
    contacts: [{
        name: String,
        _id: {
            type: String
        }
    }]
});

module.exports = Contact;
//module.exports = mongoose.model('Contact', Contact)