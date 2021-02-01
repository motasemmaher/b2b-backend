//Requiring the necessary files and models
const GarageOwnerModel = require('../../models/model/GarageOwner');
//Exporting the class
module.exports = class GarageOwner {
    constructor() {}
    //A method to get all the waitingUser in the database
    getWaitingUsers(ids, limit, skip) {
        const promiseResult = GarageOwnerModel.findWaitingUsers({
            ids: ids,
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }
    //A method to delete the garageOwner from the database by using its userId
    deleteGarageOwnerByUserId(userId) {
        const promiseResult = GarageOwnerModel.deleteGarageOwnerByUserId({
            _id: userId
        });
        return promiseResult;
    }
    //A method to get all the garageOwners in the database
    getAllGarageOwners(ids, limit, skip) {
        const promiseResult = GarageOwnerModel.findAllGarageOwners({
            ids: ids,
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }
    //A method to add a store to the stores list of the garageOwner
    addStoreToList(garageOwnerId, storeInfo) {
        const promiseResult = GarageOwnerModel.addStoreToList({
            _id: garageOwnerId,
            storeInfo: storeInfo
        });
        return promiseResult;
    }
    //A method to remove a store to the stores list of the garageOwner
    removeStoreFromList(garageOwnerId, storeId) {
        const promiseResult = GarageOwnerModel.removeStoreFromList({
            _id: garageOwnerId,
            storeId: storeId
        });
        return promiseResult;
    }
    //A method to create a garageOwner
    createGarageOwner(GarageOwnerInfo) {
        const result = GarageOwnerModel.createGarageOwner(GarageOwnerInfo);
        return result;
    }
    //A method to update a garageOwner
    updateGarageOwner(GarageOwnerId) {
        const result = GarageOwnerModel.updateGarageOwner(GarageOwnerId);
        return result;
    }
    //A method to delete a garageOwner from the database by using its ID
    deleteGarageOwner(GarageOwnerId) {
        const result = GarageOwnerModel.deleteGarageOwner(GarageOwnerId);
        return result;
    }
    //A method to get a garageOwner from the database by using its ID
    getGarageOwner(GarageOwnerId) {
        const result = GarageOwnerModel.getGarageOwner(GarageOwnerId);
        return result;
    }
    //A method to get a garageOwner from the database by using its userId
    getGarageOwnerByUserId(userId) {
        const result = GarageOwnerModel.getGarageOwnerByUserId({
            userId: userId
        });
        return result;
    }
    //A method to delete all the garageOwners from the database
    deleteAllGarageOwner() {
        const result = GarageOwnerModel.deleteAllGarageOwner();
        return result;
    }
    //A method to remove an order from the history list of a store from the list of stores of the garageOwner
    removeOrder(garageOwnerId, storeId, orderId) {
        const result = GarageOwnerModel.removeOrder({
            _id: garageOwnerId,
            storeId: storeId,
            orderId: orderId
        });
        return result;
    }
    //A method to trust a garageOwner
    trustGarageOwner(garageOwnerId)
    {
        const result = GarageOwnerModel.trustGarageOwner({
            _id: garageOwnerId,
        });
        return result;
    }
};