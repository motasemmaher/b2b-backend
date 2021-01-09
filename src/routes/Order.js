const express = require("express");
const router = express.Router();
const {userAuthenticated} = require('../middleware/authentication');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');

const product = require('../business/Objects').PRODUCT;
const warehouse = require('../business/Objects').WAREHOUSE;
const shoppingCart = require('../business/Objects').SHOPPINGCART;
const store = require('../business/Objects').STORE;
const carOwner = require('../business/Objects').CAROWNER;
const cartItem = require('../business/Objects').CARTITEM;
const order = require('../business/Objects').ORDER;
const garageOwner = require('../business/Objects').GARAGEOWNER;
const report = require('../business/Objects').REPORT;

//----------------------get Orders from Store----------------------\\
router.get('/:storeId/orders', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    const storeId = req.params.storeId;
    const status = req.query.status;

    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);

    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(garageOwnerInfo => {
            if (garageOwnerInfo.stores.includes(storeId)) {
                if (status) {
                    if (status === 'pending' || status === 'cancel' || status === 'delivered') {
                        order.getOrdersByStoreIdAndStatus(storeId, status, limit, skip)
                            .then(orders => {
                                if (orders.length > 0) {
                                    return res.send(orders);
                                } else {
                                    return res.status(404).send({
                                        error: `Error_THERE_IS_NO_ORDERS_IN_THIS_STATUS_IN_YOUR_STORES`
                                    });
                                }
                            });
                    } else {
                        return res.status(400).send({
                            error: 'error status is wrong it must be pending or cancel or delivered'
                        });
                    }
                } else {
                    order.getOrdersByStoreId(storeId, limit, skip)
                        .then(orders => {
                            return res.send(orders);
                        });
                }
            } else {
                res.status(404).send({
                    error: 'ERROR_STORE_DOES_NOT_BELONG_TO_THIS_GARAGE_OWNER'
                });
            }
        }).catch(err => {
            res.status(404).send({
                error: 'ERROR_GARAGEOWNER_IS_NOT_EXITS'
            });
        });
    } else {
        res.status(401).send({
            error: 'UNAUTHORIZED_USER'
        });
    }
});

//----------------------get Order from Store----------------------\\
router.get('/:storeId/order/:orderId', userAuthenticated, (req, res) => {

    const userInfo = req.user;
    const storeId = req.params.storeId;
    const orderId = req.params.orderId;

    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(garageOwnerInfo => {
            if (garageOwnerInfo.stores.includes(storeId)) {
                store.getOrderFromeStore(storeId, orderId)
                    .populate('orders')
                    .then(storeInfo => {
                        if (storeInfo.orders.length > 0) {
                            res.send(storeInfo.orders);
                        } else {
                            res.status(404).send({
                                error: 'ERROR_ORDER_DOES_NOT_EXISTS'
                            });
                        }
                    }).catch(err => {
                        res.status(404).send({
                            error: 'ERROR_ORDER_DOES_NOT_EXISTS'
                        });
                    });
            } else {
                res.status(404).send({
                    error: 'ERROR_STORE_DOES_NOT_BELONG_TO_THIS_GARAGE_OWNER'
                });
            }
        });
    } else {
        res.status(401).send({
            error: 'UNAUTHORIZED_USER'
        });
    }
});

//----------------processing order (accept order by garage owner or cancel the order)----------------\\
router.put('/:storeId/order/:orderId', userAuthenticated, (req, res) => {

    const userInfo = req.user;
    const status = req.body.status;
    const orderId = req.params.orderId;
    const storeId = req.params.storeId;

    date = new Date();

    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(gaOwner => {
            order.getOrder(orderId).then(retrivedOrder => {
                if (retrivedOrder.status === "pending") {
                    if ((date.getTime() - retrivedOrder.date.getTime()) >= 3600000) {
                        if (status === 'delivered' || status === 'cancel') {
                        store.updateOrderStatus(storeId, orderId, status)
                            .then(updatedOrderStatus => {
                                shoppingCart.getShoppingCart(updatedOrderStatus.shoppingCart).populate('Items').then(retrivedSoppingCart => {
                                    store.getStore(storeId).then(retrivedStore => {
                                        retrivedSoppingCart.Items.forEach((item, index) => {
                                            if (status === 'delivered') {
                                                // warehouse.decreaseAmaountOfProduct(retrivedStore.warehouse, item.product, item.quantity).then(updatedWarehouse => {
                                                if (index === retrivedSoppingCart.Items.length - 1) {
                                                    report.addOrder(gaOwner.reportId, orderId).then(updatedReport => {
                                                        res.status(200).send(updatedOrderStatus);
                                                    }).catch(err => {
                                                        res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                    });
                                                }
                                                // }).catch(err => {
                                                //     res.status(400).send('There is no available quantity in this store');
                                                // });
                                            } else if (status === 'cancel') {
                                                warehouse.increaseAmaountOfProduct(retrivedStore.warehouse, item.product, item.quantity).then(updatedWarehouse => {
                                                    product.getProductById(item.product).then(retrivedProduct => {
                                                        retrivedProduct[0].isInStock = true;
                                                        product.updateProduct(retrivedProduct[0]).then(updatedProduct => {
                                                            if (index === retrivedSoppingCart.Items.length - 1) {
                                                                report.addCancelOrder(gaOwner.reportId, orderId).then(updatedReport => {
                                                                    return res.status(200).send(updatedOrderStatus);
                                                                }).catch(err => {
                                                                    return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                                });
                                                            }
                                                        })
                                                        .catch(err => {
                                                            return res.status(500).send({
                                                                error: 'INTERNAL_SERVER_ERRORt'
                                                            });
                                                        });
                                                        }).catch(err => {
                                                        return res.status(500).send({
                                                            error: 'INTERNAL_SERVER_ERROR'
                                                        });
                                                    });
                                                    }).catch(err => {
                                                        return res.status(500).send({
                                                            error: 'INTERNAL_SERVER_ERROR'
                                                        });
                                                    });                                                                                                    
                                            }
                                        })
                                    }).catch(err => {
                                        res.status(404).send({ error:'ERROR_STORE_DOES_NOT_EXIST'});
                                    });
                                }).catch(err => {
                                    res.status(404).send({ error:'ERROR_SHOPPINGCART_DOES_NOT_EXIST'});
                                });
                            }).catch(err => {
                                res.status(404).send({ error: 'ERROR_STORE_OR_ORDER_DOES_NOT_EXIST'});
                            });
                        }
                    } else {
                        res.send({
                            error: 'ERROR_THE_USER_HAS_1_HOUR_TO_UPDATE_THE_ORDER_YOU_NEED_TO_WAIT_ONE_HOUR_TO_HAVE_THE_ABILITY_TO_UPDATE_THE_ORDER_STATUS'
                        });
                    }
                } else {
                    res.send({
                        error: 'ERROR_THE_ORDER_IS_ALREADY_PROCESSED'
                    });
                }
            }).catch(err => {
                res.status(404).send({error: 'ERROR_ORDER_ID_IS_NOT_FOUND'});
            });
        });
    } else {
        res.status(401).send({
            error: 'UNAUTHORIZED_USER'
        });
    }
});

//-------------------removeOrder----------------------\\
router.delete('/:storeId/order/:orderId', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    const storeId = req.params.storeId;
    const orderId = req.params.orderId;

    if (userInfo.role === 'garageOwner') {
        garageOwner.getGarageOwnerByUserId(userInfo._id).then(owner => {
                garageOwner.removeOrder(owner._id, storeId, orderId).then(updateGarageOwner => {
                        order.getOrder(orderId).then(orderInfo => {
                                carOwner.removeOrder(orderInfo.carOwnerId, orderId).then(updateCarOwner => {
                                        order.deleteOrder(orderId).then(deletedOrder => {
                                                shoppingCart.deleteShoppingCart(deletedOrder.shoppingCart).then(deletedShoppingCart => {
                                                    cartItem.deleteAllCartItemsAssociatedWithShoppingCartId(deletedOrder.shoppingCart).then(deletedCartItem => {
                                                        res.status(200).send({
                                                            msg: "successfully deleted order"
                                                        });
                                                    }).catch(err => {
                                                        res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                    });
                                                }).catch(err => {
                                                    res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                });
                                            })
                                            .catch(err => {
                                                res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                            });
                                    })
                                    .catch(err => {
                                        res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                    });

                            })
                            .catch(err => {
                                res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                            });
                    })
                    .catch(err => {
                        res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                    });
            })
            .catch(err => {
                res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
            });
    } else {
        res.status(401).send({
            error: 'UNAUTHORIZED_USER'
        });
    }
});

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
                        error: 'ERROR_THIS_CAR_OWNER_IS_NOT_FOUND'
                    });
                });
        }).catch(err => {
            res.status(404).send({
                error: 'ERROR_THIS_CAR_OWNER_IS_NOT_FOUND'
            });
        });
    } else {
        res.status(401).send({
            error: 'UNAUTHORIZED_USER'
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
                        error: 'ERROR_THIS_ORDER_IS_NOT_FOUND'
                    });
                });
            }).catch(err => {
                res.status(404).send({
                    error: 'ERROR_THIS_CAR_OWNER_IS_NOT_FOUND'
                });
            });
        }).catch(err => {
            res.status(404).send({
                error: 'ERROR_THIS_USER_IS_NOT_FOUND'
            });
        });
    } else {
        res.status(401).send({
            error: 'UNAUTHORIZED_USER'
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
            error: isValidOrderInfo
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
                                res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                            });
                        } else {
                            res.status(500).send({
                                error: 'INTERNAL_SERVER_ERROR'
                            });
                        }
                    } else {
                        res.status(401).send({
                            error: "UNAUTHORIZED_USER"
                        });
                    }
                } else {
                    res.status(401).send({
                        error: "UNAUTHORIZED_USER"
                    });
                }
            }).catch(err => {
                res.status(404).send({error: 'ERROR_ORDER_ID_IS_NOT_FOUND'});
            });
        }).catch(err => {
            res.status(404).send({error: 'ERROR_CAR_OWNER_IS_NOT_FOUND'});
        });
    } else {
        res.status(401).send({
            error: 'UNAUTHORIZED_USER'
        });
    }
});

module.exports = router;