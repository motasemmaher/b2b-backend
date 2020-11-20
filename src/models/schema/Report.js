const mongoose = require('mongoose');

const Order = require('./Order');

const schema = mongoose.Schema;

const Report = new schema({
    totalIncome: {type: Number},
    listOfSoldItem: [{
        type: schema.Types.ObjectId,
        ref: 'Order'
    }],
    numberOfGarageOwners: {type: Number},
    numberOfCarOwners: {type: Number}
});

module.exports = Report;
//module.exports = mongoose.model('Report', ReportSchema);