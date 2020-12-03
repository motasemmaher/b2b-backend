const CarOwnerModel = require('../../models/model/CarOwner');

module.exports =  class CarOwner {
    constructor() {}

    getAllCarOwners()
    {
        const carOwnerPromise = CarOwnerModel.findAllCarOwners();
        return carOwnerPromise;
    }

}
