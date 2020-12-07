const CarOwnerModel = require('../../models/model/CarOwner');

module.exports = class CarOwner {

    getAllCarOwners()
    {
        const carOwnerPromise = CarOwnerModel.findAllCarOwners();
        return carOwnerPromise;
    }

    constructor(CarOwner) {}

    createCarOwner(CarOwnerInfo) {
        const result = CarOwnerModel.createCarOwner(CarOwnerInfo);
        return result;
    }

    updateCarOwner(updatedCarOwner) {
        const result = CarOwnerModel.updateCarOwner(updatedCarOwner);
        return result;
    }

    deleteCarOwner(CarOwnerId) {
        const result = CarOwnerModel.deleteCarOwner(CarOwnerId);
        return result;
    }

    getCarOwner(CarOwnerId) {
        const result = CarOwnerModel.getCarOwner(CarOwnerId);
        return result;
    }

    getCarOwnerByUserId(userId) {
        const result = CarOwnerModel.getCarOwnerByUserId(userId);
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
        const result = CarOwnerModel.removeOrder({_id: carOwnerId, orderId: orderId});
        // .populate('stores')
        // .then(cOwner => {
        //     let index = cOwner.stores[0].orders.indexOf(value.orderId);
        //     cOwner.stores[0].orders.splice(index, 1);
        //     // console.log(cOwner.stores[0].orders.splice(index, 1));
        //     result = Promise.resolve(cOwner);
        // });
        return result;
    }
    clearShoppingcart(userId) {
        const result = CarOwnerModel.clearShoppingcart({user: userId});
        return result;
    }

}
