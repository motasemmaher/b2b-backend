const SubscriptionModel = require('../../models/model/Subscription');

module.exports = class Subscription {

    createSubscription(subscrpionInfo) {
        const result = SubscriptionModel.createSubscription({
            subscrpionInfo: subscrpionInfo
        });
        return result;
    }

    getSubscriptionByUserId(userId) {
        const result = SubscriptionModel.getSubscriptionByUserId({
            userId: userId
        });
        return result;
    }

    getSubscriptionByUserIdAndEndpoint(userId, endpoint) {
        const result = SubscriptionModel.getSubscriptionByUserIdAndEndpoint({
            userId: userId,
            endpoint: endpoint
        });
        return result;
    }

    deleteSubscriptionByUserId(userId) {
        const result = SubscriptionModel.deleteSubscriptionByUserId({
            userId: userId
        });
        return result;
    }
}