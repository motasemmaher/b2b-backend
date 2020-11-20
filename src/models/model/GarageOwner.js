const mongoose = require('mongoose');
const GarageOwnerSchema = require("../schema/GarageOwner");
const GarageOwnerModel= mongoose.model('GarageOwner', GarageOwnerSchema);

module.exports = {
    createGarageOwner(value) {
        const result = GarageOwnerModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation GarageOwner"
            };
        }
    },

    updateGarageOwner(value) {
        const result = GarageOwnerModel.findByIdAndUpdate({
            _id: value._id
        }, GarageOwner);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update GarageOwner"
            };
        }
    },

    deleteGarageOwner(value) {
        const result = GarageOwnerModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete GarageOwner"
            };
        }
    },

    getGarageOwner(value) {
        const result = GarageOwnerModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting GarageOwner"
            };
    },

    deleteAllGarageOwner() {
        const result = GarageOwnerModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all GarageOwners"
            };
    }
};