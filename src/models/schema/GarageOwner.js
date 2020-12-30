const mongoose = require('mongoose');

const User = require('./User');
const Store = require('./Store');

const schema = mongoose.Schema;

const GarageOwner = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    stores: [{
        type: schema.Types.ObjectId,
        ref: 'Store',
        required:true
    }],
    isVerified: {type: Boolean}
});

module.exports = GarageOwner;
//module.exports = mongoose.model('GarageOwner', GarageOwnerSchema);