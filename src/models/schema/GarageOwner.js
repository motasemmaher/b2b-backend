const mongoose = require('mongoose');

const User = require('./User');
const Store = require('./Store');

const schema = mongoose.Schema;

const GarageOwner = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    stores: [{
        type: schema.Types.ObjectId,
        ref: 'Store'
    }],
    isVerified: {type: Boolean},
    reportId: {
        type: schema.Types.ObjectId,
        ref: 'Report'
    }
});

module.exports = GarageOwner;
//module.exports = mongoose.model('GarageOwner', GarageOwnerSchema);