const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Report = new schema({
    totalIncome: {type: Number, default: 0},
    listOfSoldItems: [{
        type: schema.Types.ObjectId,
        ref: 'Order'
    }],
    listOfCancelItems: [{
        type: schema.Types.ObjectId,
        ref: 'Order'
    }],
    // numberOfGarageOwners: {type: Number, default: 0},
    // numberOfCarOwners: {type: Number, default: 0}
});

module.exports = Report;
//module.exports = mongoose.model('Report', ReportSchema);