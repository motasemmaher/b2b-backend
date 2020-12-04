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
    linkWarehouse(value)
    {
        const result = WarehouseModel.findOneAndUpdate(
                                    {_id:value._id},
                                    {storeId:value.storeId},
                                    {"useFindAndModify":false}
                               ).then().catch();
        if(result)
            return result;
        else
            return {error:"Error with the linking Warehouse"};
    }
    ,
    updateWarehouse(value)
    {
        const result = WarehouseModel.findOneAndUpdate(
                                    {storeId:value.storeId}, 
                                    {$push: {
                                        storage: {
                                        productId: value.productId,
                                        categoryId: value.categoryId,
                                        amount: value.amount
                                        }
                                    }},
                                    {"useFindAndModify":false}
                                );
        if(result)
            return result;
        else
            return {error:"Error with the update Warehouse"};
    }
    ,
    deleteWarehouse(value)
    {
        const result = WarehouseModel.findOneAndDelete({_id:value._id}).then().catch();
        if(result)
            return result;
        else
            return {error:"Error with the deletion Warehouse"};
    }
    ,
    deleteWarehouseByStoreId(value)
    {
        const result = WarehouseModel.findOneAndDelete({storeId: {$in:value.storeIds}}).then().catch();
        if(result)
            return result;
        else
            return {error:"Error with the deletion Warehouse by store id."};
    }
    /*,
    removeAllproducts(value)
    {
        const result = WarehouseModel.updateOne({_id:value.storeId},
            { $pull: { storage: {} } },
            { multi: true });
        if(result)
            return result;
        else
            return {error:"Error with the removing all products from warehouse"};
    }*/
    ,
    removeProductsFromWarehouse(value)
    {
        const result = WarehouseModel.updateOne({storeId:value.storeId},
                                 //{ $pull: { "storage.categoryId": value.categoryId  } },
                                 { $pull: { storage: { categoryId: value.categoryId } } },
                                 { multi: true });
        if(result)
            return result;
        else
            return {error:"Error with the removing products from warehouse"};
    }
    ,
    removeProductFromWarehouse(value)
    {
        const result = WarehouseModel.findOneAndUpdate({storeId:value.storeId},
                                                      { $pull: { storage: { productId: value.productId } } },
                                                      { multi: true },
                                                      //{"useFindAndModify":false}
                                                    );
        if(result)
        return result;
        else
        return {error:"Error with the removing product from warehouse"};
    }

}