const GarageOwnerModel = require('../../models/model/GarageOwner');
const User = require('../../business/User/User');

module.exports =  class GarageOwner {
    constructor() {}

    createGarageOwner(garageOwnerInfo)
    {
        const promiseResult = GarageOwnerModel.createGarageOwner(garageOwnerInfo);
        return promiseResult;
    }

    getWaitingUsers(ids)
    {
        const promiseResult = GarageOwnerModel.findWaitingUsers({ids:ids});
        return promiseResult;
    }

    getGarageOwnerByUserId(userId) {
        const result = GarageOwnerModel.getGarageOwnerByUserId({userId: userId});
        return result;
    }

    acceptWaitingUser(userId)
    {
        const promiseResult = GarageOwnerModel.acceptWaitingUser({_id:userId});
        return promiseResult;
    }

    deleteGarageOwnerByUserId(userId)
    {
        const promiseResult = GarageOwnerModel.deleteGarageOwnerByUserId({_id:userId});
        return promiseResult;
    }

    getAllGarageOwners(ids)
    {
        const promiseResult = GarageOwnerModel.findAllGarageOwners({ids:ids});
        return promiseResult;
    }
    
    addStoreToList(garageOwnerId,storeInfo)
    {
        const promiseResult = GarageOwnerModel.addStoreToList({_id:garageOwnerId,storeInfo:storeInfo});
        return promiseResult;
    }

    removeStoreFromList(garageOwnerId,storeId)
    {
        const promiseResult = GarageOwnerModel.removeStoreFromList({_id:garageOwnerId,storeId:storeId});
        return promiseResult;
    }
}

