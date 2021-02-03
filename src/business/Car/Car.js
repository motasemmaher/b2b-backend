//Requiring the necessary files and models
const CarModel = require('../../models/model/Car');
const CarValidation = require('./validate');

//Exporting the class
module.exports =  class Car {
    constructor() {}
    //A method to validate the car information
    validateCarInfo(carInfo)
    {
        const validationResult = CarValidation.validateCarInfo(carInfo);
        if(validationResult !== "pass")
            return {error:"error: "+validationResult};
    }
    //A method to check if a car exists in the database by using its ID
    exists(carId)
    {
        const promiseResult = CarModel.exists({carId:carId});
        return promiseResult;
    }
    //A method to get a car from the database by using its ID
    getCar(carId)
    {
        const promiseResult = CarModel.findCar({_id:carId});
        return promiseResult;
    }
    //A method to create a car
    createCar(carInfo)
    {
        const promiseResult = CarModel.createCar(carInfo);
        return promiseResult;
    }
    //A method to update the information of a car
    updateCar(carInfo)
    {
        const promiseResult = CarModel.updateCar(carInfo);
        return promiseResult;
    }
    //A method to delete a car from the databse by using its ID
    deleteCar(carId)
    {
        const promiseResult = CarModel.deleteCar({_id:carId});
        return promiseResult;
    }
}
