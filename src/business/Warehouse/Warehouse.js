const WarehouseModel = require('../../models/model/Warehouse')
const WarehouseValidation = require('./validate');

module.exports = class Warehouse{

    constructor(){

     }

    validateWarehouseInfo(warehouseInfo)
    {
        const validationResult = WarehouseValidation.validateWarehouseInfo(warehouseInfo);
        if(validationResult !== "pass")
            return {err:"Error: "+validationResult};
    }

    addProduct(storeId,productId,categoryId,amount)
    {
        const value = {storeId:storeId,productId:productId,categoryId:categoryId,amount:amount}
        const promiseResult = WarehouseModel.updateWarehouse(value);
        return promiseResult;
    }

    removeProductsFromWarehouse(storeId,categoryId)
    {
        const promiseResult = WarehouseModel.removeProductsFromWarehouse({storeId:storeId,categoryId:categoryId});
        return promiseResult;
    }

    removeProductFromWarehouse(storeId,productId)
    {
        const promiseResult = WarehouseModel.removeProductFromWarehouse({storeId:storeId,productId:productId});
        return promiseResult;
    }

    deleteWarehouseByStoreId(storeIds)
    {
        const promiseResult = WarehouseModel.deleteWarehouseByStoreId({storeIds:storeIds});
        return promiseResult;
    }
}
