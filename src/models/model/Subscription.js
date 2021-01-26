const mongoose = require('mongoose')
const SubscriptionSchema = require('../schema/Subscription');

const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);

module.exports = {
    createSubscription(value) {
        const result = SubscriptionModel.create(value.subscrpionInfo);
        return result;
    },

    getSubscriptionByUserId(value) {
        const result = SubscriptionModel.findOne({
            userId: value.userId
        }, {
            userId: 0
        });
        return result;
    },

    getSubscriptionByUserIdAndEndpoint(value) {
        const result = SubscriptionModel.findOne({
            $and: [{
                userId: value.userId
            }, {
                endpoint: value.endpoint
            }]
        }, {
            userId: 0
        });
        return result;
    },

    deleteSubscriptionByUserId(value) {
        const result = SubscriptionModel.findOneAndDelete({
            userId: value.userId
        });
        return result;
    }
}