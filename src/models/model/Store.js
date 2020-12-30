const mongoose = require('mongoose');
const StoreSchema = require("../schema/Store");
const StoreModel = mongoose.model('Store', StoreSchema);

module.exports = {

    exists(value) {
        const result = StoreModel.findById({
            _id: value.storeId
        }, {
            id: 1,
            userId: 1
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Store"
            };
    },

    countByGarageOwner(value) {
        const count = StoreModel.countDocuments({
            userId: value.userId
        });
        return count;
    },

    countAll() {
        const count = StoreModel.countDocuments({});
        return count;
    },

    createStore(value) {
        tags = value.tags.split(',');
        value = {
            ...value,
            tags: tags
        };
        const result = StoreModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation Store"
            };
        }
    },

    makeCopy(value) {
        const result = StoreModel.findByIdAndUpdate({
            _id: value._id
        }, {
            storeIdCopy: value.storeIdCopy
        }, {
            "useFindAndModify": false
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update Store copy"
            };
        }
    },

    updateStore(value) {
        tags = value.tags.split(',');
        value = {
            ...value,
            tags: tags
        };
        const result = StoreModel.findByIdAndUpdate({
                _id: value._id
            },
            value, {
                "useFindAndModify": false
            }
        );

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
        }).then().catch();

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete Store"
            };
        }
    },

    findStores(value) {
        const result = StoreModel.find({
            userId: value.userId
        }, {
            _id: 1
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the delete Stores by userId"
            };
    },

    findFullStores(limit, skip) {
        const result = StoreModel.find({}).select('name , address , image , openTime , closeTime').skip(skip).limit(limit) //.pretty();
        if (result)
            return result;
        else
            return {
                error: "Error with the finding all Stores"
            };
    },

    deleteStoreByUserId(value) {
        const result = StoreModel.deleteMany({
            userId: value.userId
        });

        if (result)
            return result;
        else
            return {
                error: "Error with the delete Stores by userId"
            };

    },

    findStoreById(value) {
        const result = StoreModel.findById({
            _id: value.storeId
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Store"
            };
    },

    findStoresByUserId(value) {
        const result = StoreModel.find({
            userId: value.userId
        }).skip(value.skip).limit(value.limit);
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Stores by user id"
            };
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

    async updateOrderStatus(value) {
        let result = null;
        await StoreModel.findOne({
            _id: value._id
        }, {
            orders: {
                $elemMatch: {
                    $eq: value.orderId
                }
            }
        }).populate('orders').then(store => {
            store.orders[0].status = value.status;
            result = store.orders[0].save();
        });

        if (result)
            return result;
        else
            return {
                error: "Error with the getting Store"
            };
    },

    addOrder(value) {
        const result = StoreModel.findOneAndUpdate({
            _id: value._id
        }, {
            $push: {
                orders: value.orderId
            }
        }, {
            "useFindAndModify": false
        });

        if (result)
            return result;
        else
            return {
                error: "Error with the adding order to the Store"
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
    },

    getStoresAssociatedWithGarageOwner(value) {
        const result = StoreModel.find({
            garageOwnerId: value.garageOwnerId
        });

        if (result)
            return result;
        else
            return {
                error: "Error in getStoresAssociatedWithGarageOwner"                
            };
    },

    deleteAllStore() {
        const result = StoreModel.deleteMany({});
        
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Stores by user id"
            };
    },

    getOrderFromeStore(value) {
        const result = StoreModel.findOne({
            _id: value._id
        }, {
            orders: {
                $elemMatch: {
                    $eq: value.orderId
                }
            }
        });

        if (result)
            return result;
        else
            return {                               
                error: "Error in getOrderFromeStore"
            };
    },

    // getOrdersFromeStore(value) {
    //     const result = StoreModel.findOne({
    //         _id: value._id
    //     }, {
    //         orders: 1
    //     }).limit(10).skip(0);

    //     if (result)
    //         return result;
    //     else
    //         return {
    //             error: "Error in getOrderFromeStore"
    //         };
    // },

    // getOrdersFromeStoreByStatus(value) {
    //     const result = StoreModel.findOne({
    //         _id: value._id
    //     }, {
    //         orders: {
    //             $elemMatch: {
    //                 status: value.status
    //             }
    //         }
    //     }).limit(10).skip(0);

    //     if (result)
    //         return result;
    //     else
    //         return {
    //             error: "Error in getOrderFromeStore"
    //         };
    // },

    searchStores(value) {
        const result = StoreModel.find({
                $or: [{
                        storeName: value.searchText
                    },
                    {
                        address: value.searchText
                    },
                    {
                        description: value.searchText
                    }
                ]
            }, {
                storeName: 1,
                address: 1,
                description: 1,
                opentime: 1,
                closetime: 1,
                location: 1,
            })
            .limit(value.limit)
            .skip(value.skip);

        if (result)
            return result;
        else
            return {
                error: "Error in searchSrores function"
            };
    }
};