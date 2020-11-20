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
};