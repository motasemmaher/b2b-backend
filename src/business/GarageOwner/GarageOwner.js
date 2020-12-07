const GarageOwnerModel = require('../../models/model/GarageOwner');

module.exports = class GarageOwner {
    getAllGarageOwners(ids)
    {
        const promiseResult = GarageOwnerModel.findAllGarageOwners({ids:ids});
        return promiseResult;
    }
    deleteGarageOwnerByUserId(userId)
    {
        const promiseResult = GarageOwnerModel.deleteGarageOwnerByUserId({_id:userId});
        return promiseResult;
    }

    getWaitingUsers(ids)
    {
        const promiseResult = GarageOwnerModel.findWaitingUsers({ids:ids});
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
        const result = GarageOwnerModel.getGarageOwnerByUserId({userId: userId});
        return result;
    }

    deleteAllGarageOwner() {
        const result = GarageOwnerModel.deleteAllGarageOwner();
        return result;
    }

    removeOrder(garageOwnerId, storeId, orderId) {
        const result = GarageOwnerModel.removeOrder({_id: garageOwnerId, storeId: storeId, orderId: orderId});
        return result;
    }
};
