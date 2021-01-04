const CarOwnerModel = require('../../models/model/CarOwner');

module.exports =  class CarOwner {
    constructor() {}

    createCarOwner(carOwnerInfo)
    {
        const promiseResult = CarOwnerModel.createCarOwner(carOwnerInfo);
        return promiseResult;
    }

    getCarOwnerByUserId(userId)
    {
        const promiseResult = CarOwnerModel.getCarOwnerByUserId({user:userId});
        return promiseResult;
    }

    getAllCarOwners(limit,skip)
    {
        const promiseResult = CarOwnerModel.findAllCarOwners({limit:limit,skip:skip});
        return promiseResult;
    }

    addCarToList(carOwnerId,carInfo)
    {
        const promiseResult = CarOwnerModel.addCarToList({_id:carOwnerId,carInfo:carInfo});
        return promiseResult;
    }

    removeCarFromList(carOwnerId,carId)
    {
        const promiseResult = CarOwnerModel.removeCarFromList({_id:carOwnerId,carId:carId});
        return promiseResult;
    }

    //ONLY FOR TESTING
    deleteCarOwner(carOwnerId)
    {
        const promiseResult = CarOwnerModel.deleteCarOwner({_id:carOwnerId});
        return promiseResult;
    }
}
