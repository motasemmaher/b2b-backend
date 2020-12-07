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
    deleteGarageOwnerByUserId(value) {
        const result = GarageOwnerModel.findOneAndDelete({user: value._id});
        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete GarageOwner by user id"
            };
        }
    }
    ,
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
    }
    ,
    deleteAllGarageOwner() {
        const result = GarageOwnerModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all GarageOwners"
            };
    }
    ,
    findAllGarageOwners(value) {
        const result = GarageOwnerModel.find({user : {$in:value.ids}}).populate('user').populate('stores').exec();
        if (result)
            return result;
        else
            return {error: "Error with getting all GarageOwners"};
    }
    ,
    findWaitingUsers(value) {
        const result = GarageOwnerModel.find({user : {$in:value.ids}}).populate('user').populate('stores').exec();
        if (result)
            return result;
        else
            return {error: "Error with getting all WaitingUsers"};
    },
    getGarageOwnerByUserId(value) {
        const result = GarageOwnerModel.findOne({
            user: value.userId
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting GarageOwner"
            };
    },
    addStoreToList(value)
    {
        const result = GarageOwnerModel.findByIdAndUpdate(
            { _id: value._id },
            { $push: { stores: value.storeInfo } },
            { "useFindAndModify": false }
        );
        if (result)
            return result;
        else
            return { error: "Error with the adding store to stores list" };
    },
    removeStoreFromList(value)
    {
        const result = GarageOwnerModel.findByIdAndUpdate({ _id: value._id },
            { $pull: { stores: value.storeId } },
            { multi: true },
        );
        if (result)
            return result;
        else
            return { error: "Error with the removing store from stores list" };
    }
    
};