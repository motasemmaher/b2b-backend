const express = require('express');
const router = express.Router();
const {
    userAuthenticated
} = require('../middleware/authentication');

//Requiring classes
const product = require('../business/Objects').PRODUCT;
const warehouse = require('../business/Objects').WAREHOUSE;
const shoppingCart = require('../business/Objects').SHOPPINGCART;
const store = require('../business/Objects').STORE;
const carOwner = require('../business/Objects').CAROWNER;
const cartItem = require('../business/Objects').CARTITEM;
const order = require('../business/Objects').ORDER;
const offer = require('../business/Objects').OFFER;
const subscription = require('../business/Objects').SUBSCRIPTION;

// validation by thaer
const orderInformationValidator = require('../business/Order/orderInformation');
const cartItemInformationValidator = require('../business/CartItem/cartItemInformation');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');

//---------get shoppingcart---------------\\
router.get('/shopping-cart', userAuthenticated, (req, res) => {
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);

    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    const userInfo = req.user;
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId(userInfo._id).populate('shoppingCart').then(carOwnerInfo => {
            cartItem.getCartItemsAssociatedWithShoppingCartId(carOwnerInfo.shoppingCart._id, limit, skip).populate('product')
                .then(retrivedCartItems => {
                    res.send({
                        shoppingCart: {
                            shoppingCartId: carOwnerInfo.shoppingCart._id,
                            totalBill: carOwnerInfo.shoppingCart.totalBill
                        },
                        cartItems: retrivedCartItems
                    });
                }).catch(err => {
                    res.status(404).send({error: 'ERROR_IN_SHOPPINGCART'});
                });
        }).catch(err => {
            res.status(401).send({error: 'UNAUTHORIZED_USER'});
        });
    } else {
        res.status(401).send({
                error: 'UNAUTHORIZED_USER'
        });
    }
});

//---------get cartItem from shoppingcart (back here)---------------\\
router.get('/shopping-cart/cart-item/:cartItemId', userAuthenticated, (req, res) => {
    const userInfo = req.user;
    const cartItemId = req.params.cartItemId;

    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId({
            user: userInfo._id
        }).populate('shoppingCart').then(carOwnerInfo => {
            cartItem.getCartItemAssociatedWithShoppingCartId(carOwnerInfo.shoppingCart._id, cartItemId)
                .then(retrivedCartItem => {
                    res.send({
                        cartItem: retrivedCartItem
                    });
                }).catch(err => {
                    res.status(404).send({error: 'ERROR_IN_SHOPPINGCART'});
                });
        }).catch(err => {
            res.status(401).send({error: 'UNAUTHORIZED_USER'});
        });
    } else {
        res.status(401).send({
                error: 'UNAUTHORIZED_USER'
        });
    }
});

//------------------add cartItem to shoppingcart by car owner-----------------\\
router.post('/shopping-cart/add-cart/:storeId/:productId', userAuthenticated, (req, res) => {
    const productId = req.params.productId;
    const storeId = req.params.storeId;
    const date = req.body.date;
    const userInfo = req.user;

    const isValidQuantity = cartItemInformationValidator.validateCartItemInfo({
        quantity: req.body.quantity.toString()
    });

    if (isValidQuantity !== 'pass') {
        return res.status(400).send({
            error: isValidQuantity
        });
    }

    const quantity = parseInt(req.body.quantity.toString());

    if (quantity <= 0) {
        return res.status(400).send({
            error: 'ERROR_QUANTITY_MUST_BE_MORE_THAN_ZERO'
        });
    }
    let productPrice = 0;
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId(userInfo._id).then(carOwnerInfo => {
            store.getStore(storeId)
                .then(storeInfo => {
                    product.findProductAndItsOffer(productId).then(productWithOffer => {
                        if (productWithOffer.offer != null) {
                            if (offer.exists(productWithOffer.offer._id)) {
                                productPrice = productWithOffer.offer.newPrice;
                            }
                        } else {
                            productPrice = productWithOffer.price;
                        }
                        warehouse.getProductFromWarehouse(
                            storeInfo.warehouse, productId
                        ).populate({
                            path: 'storage.productId'
                        }).then(warehouseInfo => {
                            if (warehouseInfo.storage[0].amount >= quantity) {
                                const totalPrice = productPrice * quantity;
                                if (totalPrice > 0) {
                                    cartItem.createCartItem({
                                        product: productId,
                                        quantity: quantity,
                                        date: date,
                                        storeId: storeId,
                                        shoppingCart: carOwnerInfo.shoppingCart,
                                        totalPrice: totalPrice
                                    }).then(item => {
                                        shoppingCart.addCartItem(carOwnerInfo.shoppingCart, item).then((updatedShoppingCart) => {
                                            res.status(200).send(updatedShoppingCart);
                                        });
                                    }).catch(err => {
                                        return res.status(400).send({error: 'INVALID_CARTITEM_DATA'});
                                    });
                                } else {
                                    return res.status(400).send({error:'ERROR_WITH_THE_PRICE'});
                                }
                            } else {
                                return res.status(400).send({error:'ERROR_THIS_QUANTITY_IS_NOT_AVAILABLE'});
                            }
                        }).catch(err => {
                            return res.status(404).send({
                                error: 'WAREHOUSE_IS_NOT_FOUND'
                            });
                        });
                    }).catch(err => {
                        return res.status(400).send({error:'PRODUCT_ID_IS_NOT_FOUND'});
                    });

                }).catch(err => {
                    return res.status(404).send({error:'STORE_ID_IS_NOT_FOUND'});
                });
        }).catch(err => {
            return res.status(401).send({error:'UNAUTHORIZED_USER'});
        });
    } else {
        return res.status(401).send({
            error: 'UNAUTHORIZED_USER'
        });
    }
});

//------------remove cartitem by car owner-----------\\
router.delete('/shopping-cart/remove-cart-item/:cartItemId', userAuthenticated, (req, res) => {
    const cartItemId = req.params.cartItemId;

    cartItem.getCartItem(cartItemId).then(retrivedCartItem => {
        shoppingCart.removeCartItem(retrivedCartItem.shoppingCart, cartItemId).then(updatedShoppingCart => {
            cartItem.deleteCartItem({
                _id: cartItemId
            }).then(deletedCartItem => {
                res.status(200).send(updatedShoppingCart);
            }).catch(err => {
                res.status(400).send({error: 'ERROR_IN_DELETE_CARTITEM_THERE_IS_NO_CARTITEM_WITH_THIS_ID'});            
            });
        }).catch(err => {
            res.status(400).send({error: 'ERROR_IN_REMOVE_CARTITEM_FROM_SHOPPING_CART'});
        });
    }).catch(err => {
        res.status(404).send({
            error: 'THERE_IS_NO_CARTITEM_IN_THIS_ID'
        });
    });
});

//------------update cartitem by car owner-----------\\
router.put('/shopping-cart/update-cart-item/:cartItemId', userAuthenticated, (req, res) => {
    const cartItemId = req.params.cartItemId;

    const isValidQuantity = cartItemInformationValidator.validateCartItemInfo({
        quantity: req.body.quantity.toString()
    });

    if (isValidQuantity !== 'pass') {
        return res.status(400).send({
            error: isValidQuantity
        });
    }

    const quantity = parseInt(req.body.quantity.toString());

    if (quantity <= 0) {
        return res.status(400).send({
            error: 'ERROR_QUANTITY_MUST_BE_MORE_THAN_ZERO'
        });
    }

    cartItem.getCartItem(cartItemId).then(retrivedCartItem => {
        store.getStore(retrivedCartItem.storeId).then(storeInfo => {
            warehouse.getProductFromWarehouse(
                storeInfo.warehouse, retrivedCartItem.product
            ).populate({
                path: 'storage.productId'
            }).then(warehouseInfo => {
                if (warehouseInfo.storage[0].amount >= quantity) {
                    const totalPrice = warehouseInfo.storage[0].productId.price * quantity;
                    if (totalPrice > 0) {
                        cartItem.updateCartItem({
                            _id: retrivedCartItem._id,
                            product: retrivedCartItem.product,
                            quantity: quantity,
                            storeId: retrivedCartItem.storeId,
                            date: Date.now(),
                            totalPrice: totalPrice
                        }).then(item => {
                            shoppingCart.updateShoppingCart({
                                _id: retrivedCartItem.shoppingCart
                            }).then(updatedShoppingCart => {
                                res.status(200).send(updatedShoppingCart);
                            }).catch(err => {
                                res.status(400).send({error: 'ERROR_IN_UPDATE_SHOPPING_CART'});
                            });
                        }).catch(err => {
                            res.status(400).send({error: 'ERROR_IN_UPDATE_CARTITEM'});
                        });
                    }
                }
            }).catch(err => {
                res.status(400).send({error: 'ERROR_IN_GETTING_PRODUCT_FROM_WAREHOUSE'});
            });
        }).catch(err => {
            res.status(404).send({
                error: 'ERROR_STORE_IS_NOT_EXISTS'
            });
        });
    }).catch(err => {
        res.status(404).send({
            error: 'ERROR_CARTITEM_IS_NOT_EXISTS'
        });
    });

});

//--------------------checkout Order (place Order)--------------------\\
router.post('/shopping-cart/checkout', userAuthenticated, (req, res) => {

    const userInfo = req.user;
    const deliveryAddress = req.body.deliveryAddress;
    const phoneNumber = req.body.phoneNumber.toString();
    // const date = req.body.date;
    const isValidOrderInfo = orderInformationValidator.validateOrderInfo({
        // deliveryAddress: deliveryAddress,
        phoneNumber: phoneNumber
    });

    if (isValidOrderInfo !== 'pass') {
        return res.status(400).send({
            error: isValidOrderInfo
        });
    }

    const payload = JSON.stringify({
        title: 'Push notifications with Service Workers',
    });    
        
    const status = 'pending';
    let errors = [];
    if (userInfo.role === 'carOwner') {
        try {
            carOwner.getCarOwnerByUserId(userInfo._id).populate('shoppingCart').then(owner => {
                if (owner.shoppingCart.Items.length > 0) {
                    owner.shoppingCart.Items.forEach(async (item, index) => {
                        await cartItem.getCartItem(item).then(async cart => {
                            await store.getStore(cart.storeId).then(async retrivedStore => {
                                await warehouse.getProductFromWarehouse(retrivedStore.warehouse, cart.product).then(async retrivedStorage => {
                                    if (retrivedStorage.storage[0].amount >= cart.quantity) {
                                        if (retrivedStorage.storage[0].amount === cart.quantity) {
                                            await product.getProductById(cart.product).then(async retrivedProduct => {
                                                retrivedProduct[0].isInStock = false;
                                                await product.updateProduct(retrivedProduct[0]).then(async updatedProduct => {
                                                    await warehouse.decreaseAmaountOfProduct(retrivedStore.warehouse, cart.product, cart.quantity).then(async updatedWarehouse => {
                                                        await shoppingCart.createShoppingCart({}).then(async createdShoppingCartForStore => {
                                                            cart.shoppingCart = createdShoppingCartForStore._id;
                                                            await cart.save().then(async savedCart => {
                                                                await shoppingCart.addCartItem(createdShoppingCartForStore._id, savedCart).then(async OrderCart => {
                                                                    await order.createOrder({
                                                                        shoppingCart: OrderCart,
                                                                        deliveryAddress: deliveryAddress,
                                                                        phoneNumber: phoneNumber,
                                                                        carOwnerId: owner._id,
                                                                        // date: date,
                                                                        status: status,
                                                                        storeId: cart.storeId
                                                                    }).then(async createdOrderForStore => {
                                                                        await carOwner.addOrder(
                                                                            userInfo._id,
                                                                            createdOrderForStore
                                                                        ).then(async (savedOwner) => {
                                                                            await store.addOrder(savedCart.storeId, createdOrderForStore._id)
                                                                                .then(async addedOrderToStore => {
                                                                                    if (index === owner.shoppingCart.Items.length - 1) {
                                                                                        await carOwner.clearShoppingcart(owner._id).then(clearedShoppingCart => {
                                                                                            subscription.getSubscriptionByUserId(userInfo._id).then(subscriptionInfo => {
                                                                                                webPush.sendNotification(subscriptionInfo, payload).catch(error => console.error(error));
                                                                                                res.send(addedOrderToStore);
                                                                                            }).catch(err => {
                                                                                                res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                                                            });                                                                                                                                                                                    
                                                                                        });
                                                                                    }
                                                                                }).catch(err => {
                                                                                    res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                                                });
                                                                        }).catch(err => {
                                                                            res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                                        });
                                                                    }).catch(err => {
                                                                        res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                                    });
                                                                }).catch(err => {
                                                                    res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                                });
                                                            }).catch(err => {
                                                                res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                            });
                                                        }).catch(err => {
                                                            res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                        });
                                                    }).catch(err => {
                                                        res.status(400).send({error:'ERROR THERE_IS_NO_AVAILABLE_QUANTITY_IN_THIS_STORE'});
                                                    });
                                                }).catch(err => {
                                                    res.status(400).send({
                                                        error: 'ERROR_IN_UPDATING_PRODUCT'
                                                    });
                                                });
                                            }).catch(err => {
                                                res.status(400).send({
                                                    error: 'ERROR_GETTING_PRODUCT_BY_ID_IN_UPDATING_PRODUCT'
                                                });
                                            });
                                        } else {
                                            await warehouse.decreaseAmaountOfProduct(retrivedStore.warehouse, cart.product, cart.quantity).then(async updatedWarehouse => {
                                                await shoppingCart.createShoppingCart({}).then(async createdShoppingCartForStore => {
                                                    cart.shoppingCart = createdShoppingCartForStore._id;
                                                    await cart.save().then(async savedCart => {
                                                        await shoppingCart.addCartItem(createdShoppingCartForStore._id, savedCart).then(async OrderCart => {
                                                            await order.createOrder({
                                                                shoppingCart: OrderCart,
                                                                deliveryAddress: deliveryAddress,
                                                                phoneNumber: phoneNumber,
                                                                carOwnerId: owner._id,
                                                                // date: date,
                                                                status: status,
                                                                storeId: cart.storeId
                                                            }).then(async createdOrderForStore => {
                                                                await carOwner.addOrder(
                                                                    userInfo._id,
                                                                    createdOrderForStore
                                                                ).then(async (savedOwner) => {
                                                                    await store.addOrder(savedCart.storeId, createdOrderForStore._id)
                                                                        .then(async addedOrderToStore => {
                                                                            if (index === owner.shoppingCart.Items.length - 1) {
                                                                                await carOwner.clearShoppingcart(owner._id).then(clearedShoppingCart => {
                                                                                    subscription.getSubscriptionByUserId(userInfo._id).then(subscriptionInfo => {
                                                                                        webPush.sendNotification(subscriptionInfo, payload).catch(error => console.error(error));
                                                                                        res.send(addedOrderToStore);
                                                                                    }).catch(err => {
                                                                                        res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                                                    }); 
                                                                                });
                                                                            }
                                                                        }).catch(err => {
                                                                            res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                                        });
                                                                }).catch(err => {
                                                                    res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                                });
                                                            }).catch(err => {
                                                                res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                            });
                                                        }).catch(err => {
                                                            res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                        });
                                                    }).catch(err => {
                                                        res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                    });
                                                }).catch(err => {
                                                    res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
                                                });
                                            }).catch(err => {
                                                res.status(400).send({error: 'ERROR THERE_IS_NO_AVAILABLE_QUANTITY_IN_THIS_STORE'});
                                            });
                                        }
                                    } else {
                                        // errors[cart.product] = 'error in quantity of product ' + cart.product + 'there is no available quantity';
                                        res.status(400).send({error: 'ERROR THERE_IS_NO_AVAILABLE_QUANTITY_IN_THIS_STORE'});
                                    }
                                }).catch(err => {
                                    return res.status(404).send({error: 'ERROR THERE_IS_NO_AVAILABLE_QUANTITY_IN_THIS_STORE'});
                                });

                            }).catch(err => {
                                return res.status(404).send({error:'ERROR_THERE_IS_NO_STORE'});
                            });

                        }).catch(err => {
                            res.status(404).send({error: 'ERROR_CARTITEM_IS_NOT_FOUND'});
                        });
                    });
                } else {
                    res.status(400).send({
                        error: 'ERROR_YOU_MUST_HAVE_AT_LEAST_ONE_CART_IN_YOUR_SHOPPINGCART'
                    });
                }
            }).catch(err => {
                res.status(401).send({error: 'UNAUTHORIZED_USER'});
            });
        } catch (err) {
            res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
        }
    } else {
        res.status(403).send({
            error: 'UNAUTHORIZED_USER'
        });
    }
});

module.exports = router;