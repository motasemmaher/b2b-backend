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
        const result = GarageOwnerModel.findOneAndUpdate({
            _id: value._id
        }, value, { "useFindAndModify": false });

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
        const result = GarageOwnerModel.find({user : {$in:value.ids}}).skip(value.skip).limit(value.limit).populate('user').populate('stores').exec();
        if (result)
            return result;
        else
            return {error: "Error with getting all GarageOwners"};
    }
    ,
    findWaitingUsers(value) {
        const result = GarageOwnerModel.find({user : {$in:value.ids}}).skip(value.skip).limit(value.limit).populate('user').populate('stores').exec();
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
    },
    
    deleteAllGarageOwner() {
        const result = GarageOwnerModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all GarageOwners"
            };
    },

    getStore() {
        const result = GarageOwnerModel.findOne({
            
        });

        if (result)
            return result;
        else
            return {
                error: "Error with the getStore in GarageOwners"
            };
    },

    async removeOrder(value) {
        let result = null;
        await GarageOwnerModel.findOne({_id: value._id}, {stores: {$elemMatch:  { $eq: value.storeId }}})
        .populate('stores')
        .then(owner => {
            let index = owner.stores[0].orders.indexOf(value.orderId);
            if(index >= 0 ) {
                owner.stores[0].orders.splice(index, 1);
                result = owner.stores[0].save();
            }           
            // console.log(owner.stores[0].orders.splice(index, 1));
            // result = Promise.resolve(owner);
        });

        if (result)
        return result;
    else
        return {
            error: "Error with the removeOrder in GarageOwners"
        };
    }

};