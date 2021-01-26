const express = require('express');
const router = express.Router();
const {
    userAuthenticated
} = require('../middleware/authentication');

const subscription = require('../business/Objects').SUBSCRIPTION;

// if userid and endpoint exists it will return true otherwise will return false
router.get('/subscription/:endpoint', userAuthenticated, async (req, res) => {
    const userInfo = req.user;
    const endpoint = req.body.endpoint;
    const result = await subscription.getSubscriptionByUserIdAndEndpoint(userInfo.id, endpoint);
    if (result) {
        return res.send(true);
    }
    return res.send(false);
});

router.post('/subscription', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    const endpoint = req.body.endpoint;
    const auth = req.body.auth;
    const p256dh = req.body.p256dh;
    const expirationTime = req.body.expirationTime || null;
    subscription.createSubscription({
        userId: userInfo._id,
        endpoint: endpoint,
        expirationTime: expirationTime,
        keys: {
            auth: auth,
            p256dh: p256dh
        }
    });

    res.status(201).send({
        msg: 'Subscription created'
    });
});