const CarModel = require('../../models/model/Car');
const CarValidation = require('./validate');

module.exports =  class Car {
    constructor() {}

    validateCarInfo(carInfo)
    {
        const validationResult = CarValidation.validateCarInfo(carInfo);
        if(validationResult !== "pass")
            return {err:"Error: "+validationResult};
    }

    createCar(carInfo)
    {
        const promiseResult = CarModel.createCar(carInfo);
        return promiseResult;
    }

    deleteCar(carId)
    {
        const promiseResult = CarModel.deleteCar({_id:carId});
        return promiseResult;
    }

}
