const CarModel = require('../../models/model/Car');
const CarValidation = require('./validate');

module.exports =  class Car {
    constructor() {}

    validateCarInfo(carInfo)
    {
        const validationResult = CarValidation.validateCarInfo(carInfo);
        if(validationResult !== "pass")
            return {error:"Error: "+validationResult};
    }

    exists(carId)
    {
        const promiseResult = CarModel.exists({carId:carId});
        return promiseResult;
    }

    getCar(carId)
    {
        const promiseResult = CarModel.findCar({_id:carId});
        return promiseResult;
    }

    createCar(carInfo)
    {
        const promiseResult = CarModel.createCar(carInfo);
        return promiseResult;
    }

    updateCar(carInfo)
    {
        const promiseResult = CarModel.updateCar(carInfo);
        return promiseResult;
    }

    deleteCar(carId)
    {
        const promiseResult = CarModel.deleteCar({_id:carId});
        return promiseResult;
    }

}
