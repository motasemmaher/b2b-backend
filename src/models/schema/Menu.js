const mongoose = require('mongoose');
const Category = require('./Category');

const schema = mongoose.Schema;

const Menu = new schema({
    storeId: {type: String},
    categories:[{
        type: schema.Types.ObjectId,
        ref: 'Category'
    }]
})

module.exports = Menu;