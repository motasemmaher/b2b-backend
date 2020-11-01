const mongoose = require('mongoose')
WarehouseSchema = require('../schema/Warehouse');
WarehouseModel = mongoose.model('Warehouse', WarehouseSchema);

module.exports = class Warehouse
{
    static createWarehouse(res,value)
    {
        console.log(value);
        WarehouseModel.create({storeId:value.storeId})
                      .then(result => res.send("Created Warehouse"))
                      .catch(err => res.send("Error with the creation Warehouse"));
    }
}