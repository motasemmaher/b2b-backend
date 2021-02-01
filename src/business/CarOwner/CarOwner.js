//Requiring the necessary files and models
const CarOwnerModel = require('../../models/model/CarOwner');
//Exporting the class
module.exports = class CarOwner {

    constructor() {}
    //A method to get all the carOwner
    getAllCarOwners(limit, skip) {
        const promiseResult = CarOwnerModel.findAllCarOwners({
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }
    //A method to add a car to the list of cars of a carOwner
    addCarToList(carOwnerId, carInfo) {
        const promiseResult = CarOwnerModel.addCarToList({
            _id: carOwnerId,
            carInfo: carInfo
        });
        return promiseResult;
    }
    //A method to remove a car to the list of cars of a carOwner
    removeCarFromList(carOwnerId, carId) {
        const promiseResult = CarOwnerModel.removeCarFromList({
            _id: carOwnerId,
            carId: carId
        });
        return promiseResult;
    }
    //A method to create a carOwner
    createCarOwner(CarOwnerInfo) {
        const result = CarOwnerModel.createCarOwner(CarOwnerInfo);
        return result;
    }
    //A method to update a carOwner
    updateCarOwner(updatedCarOwner) {
        const result = CarOwnerModel.updateCarOwner(updatedCarOwner);
        return result;
    }
    //A method to delete a carOwner
    deleteCarOwner(CarOwnerId) {
        const result = CarOwnerModel.deleteCarOwner({
            _id: CarOwnerId
        });
        return result;
    }
    //A method to get a carOwner by using its ID
    getCarOwner(CarOwnerId) {
        const result = CarOwnerModel.getCarOwner({
            _id: CarOwnerId
        });
        return result;
    }
    //A method to get a carOwner by using its userId
    getCarOwnerByUserId(userId) {
        const result = CarOwnerModel.getCarOwnerByUserId({
            user: userId
        });
        return result;
    }   
    //A method to delete all the carOwners
    deleteAllCarOwner() {
        const result = CarOwnerModel.deleteAllCarOwner();
        return result;
    }
    //A method to add an order to the list of orders of the carOwner
    addOrder(userId, createdOrder) {
        const promiseResult = CarOwnerModel.addOrder({
            user: userId,
            createdOrder: createdOrder
        });
        return promiseResult;
    }
    //A method to remove an order to the list of orders of the carOwner
    removeOrder(carOwnerId, orderId) {
        // let result = null;
        const result = CarOwnerModel.removeOrder({
            _id: carOwnerId,
            orderId: orderId
        });
        // .populate('stores')
        // .then(cOwner => {
        //     let index = cOwner.stores[0].orders.indexOf(value.orderId);
        //     cOwner.stores[0].orders.splice(index, 1);
        //     result = Promise.resolve(cOwner);
        // });
        return result;
    }
    //A method to delete all the items of a shoppingCart
    clearShoppingcart(userId) {
        const result = CarOwnerModel.clearShoppingcart({
            user: userId
        });
        return result;
    }
    //A method to get an order of the carOwner
    getOrder(carOwnerId, orderId) {
        const result = CarOwnerModel.getOrder({
            _id: carOwnerId,
            orderId: orderId
        });
        return result;
    }
    //A method to get all the orders of a carOwner
    getOrders(userId) {
        const result = CarOwnerModel.getOrders({
            user: userId
        });
        return result;
    }
    
    //ONLY FOR TESTING
    //A method to delete a carOwner by using his ID
    deleteCarOwner(carOwnerId)
    {
        const promiseResult = CarOwnerModel.deleteCarOwner({_id:carOwnerId});
        return promiseResult;
    }
}
