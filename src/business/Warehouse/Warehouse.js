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

    // added by thaer
    getWarehouse(warehouseId) {
        const promiseResult = WarehouseModel.getWarehouse({_id: warehouseId});
        return promiseResult;
    }

    getProductFromWarehouse(warehouseId, productId) {
        const promiseResult = WarehouseModel.getProductFromWarehouse({_id: warehouseId, productId: productId});
        return promiseResult;
    }

    decreaseAmaountOfProduct(warehouseId, productId, quantity) {
        const promiseResult = WarehouseModel.decreaseAmaountOfProduct({_id: warehouseId, productId: productId, quantity: quantity});
        return promiseResult;
    }
}
