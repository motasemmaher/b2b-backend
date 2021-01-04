const mongoose = require('mongoose');

const schema = mongoose.Schema;

const Car = new schema({
    make: {type: String,require: true,minLength: 3,maxlength: 24},
    model: {type: String,require: true,minLength: 2,maxlength: 24},
    year: {type: String,require: true}
})

module.exports = Car;
