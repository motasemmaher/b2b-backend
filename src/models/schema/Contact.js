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
        type: schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = Contact;
//module.exports = mongoose.model('Contact', Contact)