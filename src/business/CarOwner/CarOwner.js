const CarOwnerModel = require('../../models/model/CarOwner');

module.exports =  class CarOwner {
    constructor() {}

    createCarOwner(carOwnerInfo)
    {
        const promiseResult = CarOwnerModel.createCarOwner(carOwnerInfo);
        return promiseResult;
    }

    getAllCarOwners()
    {
        const carOwnerPromise = CarOwnerModel.findAllCarOwners();
        return carOwnerPromise;
    }

}
