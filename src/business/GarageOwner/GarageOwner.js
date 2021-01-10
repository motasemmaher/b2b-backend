const GarageOwnerModel = require('../../models/model/GarageOwner');
const User = require('../../business/User/User');
module.exports = class GarageOwner {
    constructor() {}

    getWaitingUsers(ids, limit, skip) {
        const promiseResult = GarageOwnerModel.findWaitingUsers({
            ids: ids,
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }

    acceptWaitingUser(userId) {
        const promiseResult = GarageOwnerModel.acceptWaitingUser({
            _id: userId
        });
        return promiseResult;
    }

    deleteGarageOwnerByUserId(userId) {
        const promiseResult = GarageOwnerModel.deleteGarageOwnerByUserId({
            _id: userId
        });
        return promiseResult;
    }

    getAllGarageOwners(ids, limit, skip) {
        const promiseResult = GarageOwnerModel.findAllGarageOwners({
            ids: ids,
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }

    addStoreToList(garageOwnerId, storeInfo) {
        const promiseResult = GarageOwnerModel.addStoreToList({
            _id: garageOwnerId,
            storeInfo: storeInfo
        });
        return promiseResult;
    }
    /*
    acceptWaitingUser(userId)
    {
        const promiseResult = GarageOwnerModel.acceptWaitingUser({_id:userId});
        return promiseResult;
    }
    */
    deleteGarageOwnerByUserId(userId)
    {
        const promiseResult = GarageOwnerModel.deleteGarageOwnerByUserId({_id:userId});
        return promiseResult;
    }

    removeStoreFromList(garageOwnerId, storeId) {
        const promiseResult = GarageOwnerModel.removeStoreFromList({
            _id: garageOwnerId,
            storeId: storeId
        });
        return promiseResult;
    }

    createGarageOwner(GarageOwnerInfo) {
        const result = GarageOwnerModel.createGarageOwner(GarageOwnerInfo);
        return result;
    }

    updateGarageOwner(GarageOwnerId) {
        const result = GarageOwnerModel.updateGarageOwner(GarageOwnerId);
        return result;
    }

    deleteGarageOwner(GarageOwnerId) {
        const result = GarageOwnerModel.deleteGarageOwner(GarageOwnerId);
        return result;
    }

    getGarageOwner(GarageOwnerId) {
        const result = GarageOwnerModel.getGarageOwner(GarageOwnerId);
        return result;
    }

    getGarageOwnerByUserId(userId) {
        const result = GarageOwnerModel.getGarageOwnerByUserId({
            userId: userId
        });
        return result;
    }

    deleteAllGarageOwner() {
        const result = GarageOwnerModel.deleteAllGarageOwner();
        return result;
    }

    removeOrder(garageOwnerId, storeId, orderId) {
        const result = GarageOwnerModel.removeOrder({
            _id: garageOwnerId,
            storeId: storeId,
            orderId: orderId
        });
        return result;
    }

    trustGarageOwner(garageOwnerId)
    {
        const result = GarageOwnerModel.trustGarageOwner({
            _id: garageOwnerId,
        });
        return result;
    }
};