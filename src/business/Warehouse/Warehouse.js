//Requiring the necessary files and models
const WarehouseModel = require('../../models/model/Warehouse')
const WarehouseValidation = require('./validate');
//Exporting the class
module.exports = class Warehouse{

    constructor() {}
    //A method to validate the warehouse information
    validateWarehouseInfo(warehouseInfo)
    {
        const validationResult = WarehouseValidation.validateWarehouseInfo(warehouseInfo);
        if(validationResult !== "pass")
            return {error:"Error: "+validationResult};
    }
    //A method to create warehouse
    createWarehouse()
    {
        const promiseResult = WarehouseModel.createWarehouse();
        return promiseResult;
    }
    //A method to delete warehouse by using its ID
    deleteWarehouse(warehouseId)
    {
        const promiseResult = WarehouseModel.deleteWarehouse({_id:warehouseId});
        return promiseResult;
    }
    //A method to link warehouse to a store by using storeID
    linkWarehouse(info)
    {
        const promiseResult = WarehouseModel.linkWarehouse(info);
        return promiseResult;
    }
    //A method to add a product and its quantity to the warehouse
    addProduct(storeId,productId,categoryId,amount)
    {
        const value = {storeId,productId,categoryId,amount}
        const promiseResult = WarehouseModel.updateWarehouse(value);
        return promiseResult;
    }
    //A method to remove products of a category from the warehouse
    removeProductsFromWarehouse(storeId,categoryId)
    {
        const promiseResult = WarehouseModel.removeProductsFromWarehouse({storeId,categoryId});
        return promiseResult;
    }
    //A method to remove a product and its quantity to the warehouse
    removeProductFromWarehouse(storeId,productId)
    {
        const promiseResult = WarehouseModel.removeProductFromWarehouse({storeId,productId});
        return promiseResult;
    }
    //A method to delete a warehouse from the database by using storeID
    deleteWarehouseByStoreId(storeIds)
    {
        const promiseResult = WarehouseModel.deleteWarehouseByStoreId({storeIds});
        return promiseResult;
    }
    
    // added by thaer
    //A method to get a warehouse by its ID
    getWarehouse(warehouseId) {
        const promiseResult = WarehouseModel.getWarehouse({_id: warehouseId});
        return promiseResult;
    }
    //A method to get a product from teh warehouse by the productId
    getProductFromWarehouse(warehouseId, productId) {
        const promiseResult = WarehouseModel.getProductFromWarehouse({_id: warehouseId, productId});
        return promiseResult;
    }
    //A method to decrease  the amount of a product in the warehouse
    decreaseAmaountOfProduct(warehouseId, productId, quantity) {
        const promiseResult = WarehouseModel.decreaseAmaountOfProduct({_id: warehouseId,  productId, quantity});
        return promiseResult;
    }
    //A method to increase  the amount of a product in the warehouse
    increaseAmaountOfProduct(warehouseId, productId, quantity) {        
        const promiseResult = WarehouseModel.increaseAmaountOfProduct({_id: warehouseId, productId, quantity});
        return promiseResult;
    }
}
