const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Car = new schema({
    userId: {type: String,require: true},
    model: {type: String,require: true},
    make: {type: String,require: true},
    year: {type: String,require: true}
})

module.exports = Car;
