const mongoose = require('mongoose');
const CarOwner = require('./CarOwner');
const GarageOwner = require('./GarageOwner');

const User = require('./User');

const schema = mongoose.Schema;

const Admin = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    carOwner: [{
        type: schema.Types.ObjectId,
        ref: 'CarOwner'
    }],
    garageOwner: [{
        type: schema.Types.ObjectId,
        ref: 'GarageOwner'
    }],
    waitingUsers: [{
        type: schema.Types.ObjectId,
        ref: 'GarageOwner'
    }]
});

module.exports = Admin;
//module.exports = mongoose.model('Admin', AdminSchema);