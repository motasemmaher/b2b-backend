const mongoose = require('mongoose');
const Category = require('./Category');

const schema = mongoose.Schema;

const Menu = new schema({
    storeId: {type: String,unique: true,required: true},
    Categories:[Category]
})

module.exports = Menu;