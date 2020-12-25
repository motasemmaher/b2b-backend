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
    }]
});

module.exports = Report;
//module.exports = mongoose.model('Report', ReportSchema);