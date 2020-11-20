const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Car = new schema({
    model: {type: String,require: true},
    make: {type: String,require: true},
    year: {type: String,require: true}
})

module.exports = Car;
