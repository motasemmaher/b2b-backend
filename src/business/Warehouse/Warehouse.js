const WarehouseModel = require('../../models/model/Warehouse')


module.exports = class Warehouse{

    constructor(){

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

}
