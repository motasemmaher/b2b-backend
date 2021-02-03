//Requiring the necessary files and models
const StoreModel = require('../../models/model/Store');
const StoreValidation = require('./validate');
//Exporting the class
module.exports = class Store {
    constructor() {}
    //A method to validate the store information
    validateStoreInfo(storeInfo) {
        const validationResult = StoreValidation.validateStoreInfo(storeInfo);
        if (validationResult !== "pass")
            return {
                error: "Error: " + validationResult
            };
    }
    //A method to check if the store exists in the database by using its ID
    exists(storeId) {
        const promiseResult = StoreModel.exists({storeId});
        return promiseResult;
    }
    //A method to get the count of all the stores stored in the database
    countAll() {
        const promiseResult = StoreModel.countAll();
        return promiseResult;
    }
    //A method to get the count of  the stores that belong to a specific garageOwner
    countByGarageOwner(userId) {
        const promiseResult = StoreModel.countByGarageOwner({userId});
        return promiseResult;
    }
    //A method to get the count of all the stores that shares the same address of the logged user
    countBySameAddress(address)
    {
        const promiseResult = StoreModel.countBySameAddress({address});
        return promiseResult;
    }
    //A method to create a store
    createStore(storeInfo)
    {
        const promiseResult = StoreModel.createStore(storeInfo);
        return promiseResult;
    }
    //A method to update a store
    updateStore(storeInfo) {
        const promiseResult = StoreModel.updateStore(storeInfo);
        return promiseResult;
    }
    //A method to delete a store from the databse by using its ID
    deleteStore(storeId) {
        const promiseResult = StoreModel.deleteStore({_id: storeId});
        return promiseResult;
    }
    //A method to get a store from the database by using its ID
    getStoreById(storeId) {
        const promiseResult = StoreModel.findStoreById({storeId});
        return promiseResult;
    }
    //A method to get all the stores
    getAllStores(limit,skip)
    {
        const promiseResult = StoreModel.findFullStores({limit,skip});
        return promiseResult;
    }
    //A method to get the stores of a garageOwner
    getStoresByUserId(userId) {
        const promiseResult = StoreModel.findStores({userId});
        return promiseResult;
    }
    //A method to get the ID of the stores of a garageOwner
    getStoresIdByUserId(userId) {
        const promiseResult = StoreModel.findStoresIdAndName({userId});
        return promiseResult;
    }
    //A method to get the full the stores of a garageOwner by userId
    getFullStoresByUserId(userId, limit, skip) {
        const promiseResult = StoreModel.findStoresByUserId({userId,limit,skip});
        return promiseResult;
    }
    //A method to get the store that shares the same addrss of the logged user
    getSameAddressStores(address,limit,skip)
    {
        const promiseResult = StoreModel.findSameAddressStores({address,limit,skip});
        return promiseResult;
    }
    //A method to get the store sorted ascending by the distance from the current logged user
    getStoresByLocation(lat,long,limit,skip)
    {
        const promiseResult = StoreModel.findStoresByLocation({lat,long,limit,skip});
        return promiseResult;
    }
    //A method to delete all the stores associated with a garageOwner
    deleteStoreByUserId(userId)
    {
        const promiseResult = StoreModel.deleteStoreByUserId({userId});
        return promiseResult;
    }

    // added by thaer
    //A method to get a store from the database by using its ID
    getStore(storeId) {
        const result = StoreModel.getStore({_id: storeId});
        return result;
    }
    //A method to delete all the sstores stored in the database
    deleteAllStore() {
        const result = StoreModel.deleteAllStore();
        return result;
    }
    //A method to update the order status
    updateOrderStatus(storeId, orderId, status) {
        const result = StoreModel.updateOrderStatus({_id: storeId,orderId,status});
        return result;
    }
    //A method to add order to the list of orders of the store
    addOrder(storeId, orderId) {
        const result = StoreModel.addOrder({_id: storeId,orderId});
        return result;
    }
    //A method to get the full the stores of a garageOwner by garageOwnerId
    getStoresAssociatedWithGarageOwner(garageOwnerId) {
        const result = StoreModel.getStoresAssociatedWithGarageOwner({garageOwnerId});
        return result;
    }
    //A method to get the orders of a store
    getOrderFromeStore(storeId, orderId) {
        const result = StoreModel.getOrderFromeStore({_id: storeId,orderId});
        return result;
    }
    //A method to search through the stores
    searchStores(searchText, limit, skip) {
        const result = StoreModel.searchStores({searchText,limit,skip});
        return result;
    }
}