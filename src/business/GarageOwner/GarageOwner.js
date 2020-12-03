const GarageOwnerModel = require('../../models/model/GarageOwner');
const User = require('../../business/User/User');

module.exports =  class GarageOwner {
    constructor() {}

    getWaitingUsers(ids)
    {
        const waitingUsersPromise = GarageOwnerModel.findWaitingUsers({ids:ids});
        return waitingUsersPromise;
    }

    acceptWaitingUser(userId)
    {
        const waitingUserPromise = GarageOwnerModel.acceptWaitingUser({_id:userId});
        return waitingUserPromise;
    }

    deleteGarageOwnerByUserId(userId)
    {
        const waitingUserPromise = GarageOwnerModel.deleteGarageOwnerByUserId({_id:userId});
        return waitingUserPromise;
    }

    getAllGarageOwners(ids)
    {
        const garageOwnerPromise = GarageOwnerModel.findAllGarageOwners({ids:ids});
        return garageOwnerPromise;
    }
    
}

