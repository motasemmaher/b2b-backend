const mongoose = require('mongoose')
WarehouseSchema = require('../schema/Warehouse');

WarehouseModel = mongoose.model('Warehouse', WarehouseSchema);

module.exports =  
{
    //value
    createWarehouse(storeId)
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
                                );
        if(result)
            return result;
        else
            return {error:"Error with the update Warehouse"};
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
        const result = WarehouseModel.findOneAndDelete({_id:value._id}).then(()=> console.log("Deleted warehouse")).catch(()=>console.log("Error with deleting warehouse"));
        if(result)
            return result;
        else
            return {error:"Error with the deletion Warehouse"};
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
                                 { $pull: { "storage.cateoryId": value.categoryId  } },
                                 //{ $pull: { storage: { categoryId: value.categoryId } } },
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