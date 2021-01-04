const mongoose = require('mongoose');
const Category = require('./Category');

const schema = mongoose.Schema;

const Menu = new schema({
    storeId: {
        type: schema.Types.ObjectId,
        ref: 'Store'
    },
    categories:[{
        type: schema.Types.ObjectId,
        ref: 'Category'
    }]
})

module.exports = Menu;