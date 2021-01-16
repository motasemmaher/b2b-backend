const CarOwnerModel = require('../../models/model/CarOwner');
module.exports = class CarOwner {

    constructor() {}

    getAllCarOwners(limit, skip) {
        const promiseResult = CarOwnerModel.findAllCarOwners({
            limit: limit,
            skip: skip
        });
        return promiseResult;
    }

    addCarToList(carOwnerId, carInfo) {
        const promiseResult = CarOwnerModel.addCarToList({
            _id: carOwnerId,
            carInfo: carInfo
        });
        return promiseResult;
    }

    removeCarFromList(carOwnerId, carId) {
        const promiseResult = CarOwnerModel.removeCarFromList({
            _id: carOwnerId,
            carId: carId
        });
        return promiseResult;
    }

    createCarOwner(CarOwnerInfo) {
        const result = CarOwnerModel.createCarOwner(CarOwnerInfo);
        return result;
    }

    updateCarOwner(updatedCarOwner) {
        const result = CarOwnerModel.updateCarOwner(updatedCarOwner);
        return result;
    }

    deleteCarOwner(CarOwnerId) {
        const result = CarOwnerModel.deleteCarOwner({
            _id: CarOwnerId
        });
        return result;
    }

    getCarOwner(CarOwnerId) {
        const result = CarOwnerModel.getCarOwner({
            _id: CarOwnerId
        });
        return result;
    }

    getCarOwnerByUserId(userId) {
        const result = CarOwnerModel.getCarOwnerByUserId({
            user: userId
        });
        return result;
    }

    deleteAllCarOwner() {
        const result = CarOwnerModel.deleteAllCarOwner();
        return result;
    }

    addOrder(userId, createdOrder) {
        const promiseResult = CarOwnerModel.addOrder({
            user: userId,
            createdOrder: createdOrder
        });
        return promiseResult;
    }

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
    clearShoppingcart(userId) {
        const result = CarOwnerModel.clearShoppingcart({
            user: userId
        });
        return result;
    }

    getOrder(carOwnerId, orderId) {
        const result = CarOwnerModel.getOrder({
            _id: carOwnerId,
            orderId: orderId
        });
        return result;
    }

    getOrders(userId) {
        const result = CarOwnerModel.getOrders({
            user: userId
        });
        return result;
    }
    
    //ONLY FOR TESTING
    deleteCarOwner(carOwnerId)
    {
        const promiseResult = CarOwnerModel.deleteCarOwner({_id:carOwnerId});
        return promiseResult;
    }
}
