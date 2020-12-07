const mongoose = require('mongoose');
const { remove } = require('../schema/GarageOwner');
const GarageOwnerSchema = require("../schema/GarageOwner");
const { removeProductFromCategory } = require('./Category');
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
    },

    getGarageOwnerByUserId(value) {
        // console.log(value);
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
                error: "Error with the delete all GarageOwners"
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
    }
    
};