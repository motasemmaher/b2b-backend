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
                                        error: `there is no ${status} orders in your stores`
                                    });
                                }
                            });
                    } else {
                        return res.status(400).send({
                            error: 'status is wrong it must be pending or cancel or delivered'
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
                    error: 'store does not belong to this garage owner'
                });
            }
        }).catch(err => {
            res.status(404).send({
                error: 'garageOwner is not exits'
            });
        });
    } else {
        res.status(403).send({
            error: 'you cannot access this page'
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
                                error: 'order does not exists'
                            });
                        }
                    }).catch(err => {
                        res.status(404).send({
                            error: 'order does not exists'
                        });
                    });
            } else {
                res.status(404).send({
                    error: 'store does not belong to this garage owner'
                });
            }
        });
    } else {
        res.status(403).send({
            error: 'you cannot access this page'
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
                                                        res.status(500).send({error: 'Internal server error'});
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
                                                                    return res.status(500).send({error: 'Internal server error'});
                                                                });
                                                            }
                                                        })
                                                        .catch(err => {
                                                            return res.status(400).send({
                                                                error: 'error in increaseAmaountOfProduct'
                                                            });
                                                        });
                                                        }).catch(err => {
                                                        return res.status(400).send({
                                                            error: 'error in updateProduct in processing order'
                                                        });
                                                    });
                                                    }).catch(err => {
                                                        return res.status(400).send({
                                                            error: 'error in get Product By Id in processing order'
                                                        });
                                                    });                                                                                                    
                                            }
                                        })
                                    }).catch(err => {
                                        res.status(404).send({ error:'store does not exist'});
                                    });
                                }).catch(err => {
                                    res.status(404).send({ error:'shoppingCart does not exist'});
                                });
                            }).catch(err => {
                                res.status(404).send({ error: 'Store Or order does not exist'});
                            });
                        }
                    } else {
                        res.send({
                            error: 'The user has 1 hour to update the order you need to wait one hour to have the ability to update the order status'
                        });
                    }
                } else {
                    res.send({
                        error: 'The Order is Already processed'
                    });
                }
            }).catch(err => {
                res.status(404).send({error: 'There is no order in this id'});
            });
        });
    } else {
        res.status(403).send({
            error: 'you cannot access this page'
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
                                                        res.status(500).send({error: 'Internal server error'});
                                                    });
                                                }).catch(err => {
                                                    res.status(500).send({error: 'Internal server error'});
                                                });
                                            })
                                            .catch(err => {
                                                res.status(500).send({error: 'Internal server error'});
                                            });
                                    })
                                    .catch(err => {
                                        res.status(500).send({error: 'Internal server error'});
                                    });

                            })
                            .catch(err => {
                                res.status(500).send({error: 'Internal server error'});
                            });
                    })
                    .catch(err => {
                        res.status(500).send({error: 'Internal server error'});
                    });
            })
            .catch(err => {
                res.status(500).send({error: 'Internal server error'});
            });
    } else {
        res.status(403).send({
            error: 'you cannot access this page'
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
                        error: 'this carOwner is not found'
                    });
                });
        }).catch(err => {
            res.status(404).send({
                error: 'this user is not found'
            });
        });
    } else {
        res.status(403).send({
            error: 'you cannot access this page'
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
                        error: 'thisorder is not found'
                    });
                });
            }).catch(err => {
                res.status(404).send({
                    error: 'this car owner is not found'
                });
            });
        }).catch(err => {
            res.status(404).send({
                error: 'this user is not found'
            });
        });
    } else {
        res.status(403).send({
            error: 'you cannot access this page'
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
                                res.status(500).send({error: 'Internal server error'});
                            });
                        } else {
                            res.status(500).send({
                                error: 'You cannot update your order now accepted time has elapsed'
                            });
                        }
                    } else {
                        res.status(403).send({
                            error: "You don't have access to this order"
                        });
                    }
                } else {
                    res.status(403).send({
                        error: "This order is delivered or cancel"
                    });
                }
            }).catch(err => {
                res.status(404).send({error: 'order ID is not found'});
            });
        }).catch(err => {
            res.status(404).send({error: 'car owner is not found'});
        });
    } else {
        res.status(403).send({
            error: 'you cannot access this page'
        });
    }
});

module.exports = router;