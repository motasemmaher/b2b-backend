const mongoose = require('mongoose')
MenuSchema = require('../schema/Menu');
MenuModel = mongoose.model('Menu', MenuSchema);

module.exports = class Menu
{
    static createMenu(res,value)
    {
        console.log(value);
        MenuModel.create({storeId:value.storeId})
                 .then(result => res.send("Created Menu"))
                 .catch(err => res.send("Error with the creation Menu"));
    }
}