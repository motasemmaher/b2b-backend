const mongoose = require('mongoose');
const StoreSchema = require("../schema/Store");
const StoreModel= mongoose.model('Store', StoreSchema);

module.exports = {
    createStore(value) {
        const result = StoreModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation Store"
            };
        }
    },

    updateStore(value) {
        const result = StoreModel.findByIdAndUpdate({
            _id: value._id
        }, Store);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update Store"
            };
        }
    },

    deleteStore(value) {
        const result = StoreModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete Store"
            };
        }
    },

    getStore(value) {
        const result = StoreModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Store"
            };
    },

    deleteAllStore() {
        const result = StoreModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all Stores"
            };
    }
};