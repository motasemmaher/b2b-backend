const mongoose = require('mongoose');
const Category = require('./Category');

const schema = mongoose.Schema;

const Menu = new schema({
    //storeId: {type: String,required: true},
    Categories:[{
        type: schema.Types.ObjectId,
        ref: 'Category'
    }]
})

module.exports = Menu;