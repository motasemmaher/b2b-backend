const mongoose = require('mongoose')
WarehouseSchema = require('../schema/Warehouse');

WarehouseModel = mongoose.model('Warehouse', WarehouseSchema);

module.exports =  
{
    //value
    createWarehouse()
    {
        //{storeId:value.storeId}
        const result = WarehouseModel.create({});
        if(result)
            return result;
        else
            return {error:"Error with the creation Warehouse"};
    }
    ,
    deleteWarehouse(value)
    {
        const result = WarehouseModel.findOneAndDelete({_id:value._id});
        if(result)
            return result;
        else
            return {error:"Error with the deletion Warehouse"};
    },

    getWarehouse(value) {
        const result = WarehouseModel.findById({_id: value._id});
        if(result)
            return result;
        else
            return {error:"Error with the finding Warehouse"};
    },

    getProductFromWarehouse(value) {
        const result = WarehouseModel.findOne({_id: value._id}, {storage: {$elemMatch: {productId: value.productId}}});
        if(result)
            return result;
        else
            return {error:"Error with the finding Warehouse"};
    }

}