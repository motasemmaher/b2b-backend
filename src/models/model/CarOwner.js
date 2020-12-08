const mongoose = require('mongoose');
const CarOwnerSchema = require("../schema/CarOwner");
const CarOwnerModel= mongoose.model('CarOwner', CarOwnerSchema);

module.exports = {
    createCarOwner(value) {
        const result = CarOwnerModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation CarOwner"
            };
        }
    },

    updateCarOwner(value) {
        const result = CarOwnerModel.findByIdAndUpdate({
            _id: value._id
        }, CarOwner);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update CarOwner"
            };
        }
    },

    deleteCarOwner(value) {
        const result = CarOwnerModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete CarOwner"
            };
        }
    },

    getCarOwner(value) {
        const result = CarOwnerModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting CarOwner"
            };
    },

    getCarOwnerByUserId(value) {
        const result = CarOwnerModel.findOne({
            user: value.user
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting CarOwner"
            };
    },

    deleteAllCarOwner() {
        const result = CarOwnerModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all CarOwners"
            };
    }
    ,
    findAllCarOwners() {
        const result = CarOwnerModel.find({}).populate('user').populate('cars').exec();
        if (result)
            return result;
        else
            return {error: "Error with the getting all CarOwners"};
    }
    ,
    addCarToList(value)
    {
        const result = CarOwnerModel.findByIdAndUpdate(
            { _id: value._id },
            { $push: { cars: value.carInfo } },
            { "useFindAndModify": false }
        );
        if (result)
            return result;
        else
            return { error: "Error with the adding car to cars list" };
    },
    removeCarFromList(value)
    {
        const result = CarOwnerModel.findByIdAndUpdate({ _id: value._id },
            { $pull: { cars: value.carId } },
            { multi: true },
        );
        if (result)
            return result;
        else
            return { error: "Error with the removing car from cars list" };
    }
};