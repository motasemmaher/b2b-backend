const express = require('express');
const router = express.Router();

const {
    userAuthenticated
} = require('../middleware/authentication');

//Requiring classes
const carOwner = require('../business/Objects').CAROWNER;
const order = require('../business/Objects').ORDER;

const limitAndSkipValidation = require('../shared/limitAndSkipValidation');

router.get('/car-owner/orders', userAuthenticated, (req, res) => {
    const userInfo = req.user;

    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);

    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId(userInfo._id).then(cOwner => {
            order.getOrderByCarOwnerId(cOwner._id, limit, skip)
                .then(orders => {
                    res.send(orders);
                })
                .catch(err => {
                    res.status(404).send({
                        Error: 'this carOwner is not found'
                    });
                });
        }).catch(err => {
            res.status(404).send({
                Error: 'this user is not found'
            });
        });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});
//------------------this method for retrived order to car owner------------------\\
router.get('/car-owner/orders/:orderId', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    const orderId = req.params.orderId;
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId(userInfo._id).then(cOwner => {
            carOwner.getOrder(cOwner._id, orderId).then(orderId => {
                order.getOrder(orderId).then(retrivedOrder => {
                    res.send(retrivedOrder);
                }).catch(err => {
                    res.status(404).send({
                        Error: 'thisorder is not found'
                    });
                });
            }).catch(err => {
                res.status(404).send({
                    Error: 'this car owner is not found'
                });
            });
        }).catch(err => {
            res.status(404).send({
                Error: 'this user is not found'
            });
        });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

//------------------------maintain order------------------------\\
router.put('/car-owner/maintain/:orderId', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    const orderId = req.params.orderId;
    const deliveryAddress = req.body.deliveryAddress;

    const phoneNumber = req.body.phoneNumber.toString();
    const isValidOrderInfo = orderInformationValidator.validateOrderInfo({
        phoneNumber: phoneNumber
    });

    if (isValidOrderInfo !== 'pass') {
        return res.status(400).send({
            Error: isValidOrderInfo
        });
    }

    date = new Date();
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId({
            user: userInfo._id
        }).then(cOwner => {
            order.getOrder(orderId).then(retrivedOrder => {
                if (retrivedOrder.status === 'pending') {
                    if (cOwner._id.equals(retrivedOrder.carOwnerId)) {
                        if ((date.getTime() - retrivedOrder.date.getTime()) >= 3600000) {
                            retrivedOrder.deliveryAddress = deliveryAddress;
                            retrivedOrder.phoneNumber = phoneNumber;
                            order.updateOrder(retrivedOrder).then(updatedOrder => {
                                res.send(updatedOrder);
                            }).catch(err => {
                                res.status(500).send({Error: 'error in updating Order'});
                            });
                        } else {
                            res.send({
                                Error: 'You cannot update your order now accepted time has elapsed'
                            });
                        }
                    } else {
                        res.status(403).send({
                            Error: "You don't have access to this order"
                        });
                    }
                } else {
                    res.status(403).send({
                        Error: "This order is delivered or cancel"
                    });
                }
            }).catch(err => {
                res.status(404).send({Error: 'order ID is not found'});
            });
        }).catch(err => {
            res.status(404).send({Error: 'car owner is not found'});
        });
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

module.exports = router;