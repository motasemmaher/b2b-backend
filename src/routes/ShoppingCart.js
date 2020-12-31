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


// validation by thaer
const orderInformationValidator = require('../business/Order/orderInformation');
const cartItemInformationValidator = require('../business/CartItem/cartItemInformation');
const limitAndSkipValidation = require('../shared/limitAndSkipValidation');

//---------get shoppingcart---------------\\
router.get('', userAuthenticated, (req, res) => {
    let skip = req.query.skip;
    let limit = req.query.limit;
    const limitAndSkipValues = limitAndSkipValidation.limitAndSkipValues(limit, skip);

    skip = limitAndSkipValues.skip;
    limit = limitAndSkipValues.limit;

    const userInfo = req.user;
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId(userInfo._id).populate('shoppingCart').then(carOwnerInfo => {
            cartItem.getCartItemsAssociatedWithShoppingCartId(carOwnerInfo.shoppingCart._id, limit, skip)
                .then(retrivedCartItems => {
                    res.send({
                        shoppingCart: {
                            shoppingCartId: carOwnerInfo.shoppingCart._id,
                            totalBill: carOwnerInfo.shoppingCart.totalBill
                        },
                        cartItems: retrivedCartItems
                    });
                }).catch(err => {
                    res.status(404).send(err);
                });
        }).catch(err => {
            res.status(404).send(err);
        });
    } else {
        res.status(403).send({
            Error: {
                Error: 'you cannot access this page'
            }
        });
    }
});

//---------get cartItem from shoppingcart (back here)---------------\\
router.get('/cart-item/:cartItemId', userAuthenticated, (req, res) => {
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
                    res.status(404).send(err);
                });
        }).catch(err => {
            res.status(404).send(err);
        });
    } else {
        res.status(403).send({
            Error: {
                Error: 'you cannot access this page'
            }
        });
    }
});

//------------------add cartItem to shoppingcart by car owner-----------------\\
router.post('/add-cart/:storeId/:productId', userAuthenticated, (req, res) => {
    const productId = req.params.productId;
    const storeId = req.params.storeId;
    const date = req.body.date;
    const userInfo = req.user;

    const isValidQuantity = cartItemInformationValidator.validateCartItemInfo({
        quantity: req.body.quantity.toString()
    });

    if (isValidQuantity !== 'pass') {
        return res.status(400).send({
            Error: isValidQuantity
        });
    }

    const quantity = parseInt(req.body.quantity.toString());

    if (quantity <= 0) {
        return res.status(400).send({
            Error: 'Quantity must be more than Zero'
        });
    }
    let productPrice = 0;
    if (userInfo.role === 'carOwner') {
        carOwner.getCarOwnerByUserId(userInfo._id).then(carOwnerInfo => {
            store.getStore(storeId)
                .then(storeInfo => {
                    product.findProductAndItsOffer(productId).then(productWithOffer => {
                        console.log(productWithOffer);
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
                                        return res.status(401).send(err);
                                    });
                                } else {
                                    return res.status(401).send('Error With The Price');
                                }
                            } else {
                                return res.status(401).send('Error This Quantity Is not available');
                            }
                        }).catch(err => {
                            return res.status(404).send({
                                err: 'warehouse is not found'
                            });
                        });
                    }).catch(err => {
                        return res.status(400).send('product id not found');
                    });

                }).catch(err => {
                    return res.status(404).send(err);
                });
        }).catch(err => {
            return res.status(404).send(err);
        });
    } else {
        return res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

//------------remove cartitem by car owner-----------\\
router.delete('/remove-cart-item/:cartItemId', userAuthenticated, (req, res) => {
    const cartItemId = req.params.cartItemId;

    cartItem.getCartItem(cartItemId).then(retrivedCartItem => {
        shoppingCart.removeCartItem(retrivedCartItem.shoppingCart, cartItemId).then(updatedShoppingCart => {
            cartItem.deleteCartItem({
                _id: cartItemId
            }).then(deletedCartItem => {
                res.status(200).send(updatedShoppingCart);
            }).catch(err => {
                res.status(501).send(err);
            });
        }).catch(err => {
            res.status(501).send(err);
        });
    }).catch(err => {
        res.status(404).send({
            error: 'there is no cartItem in this id'
        });
    });
});

//------------update cartitem by car owner-----------\\
router.put('/update-cart-item/:cartItemId', userAuthenticated, (req, res) => {
    const cartItemId = req.params.cartItemId;

    const isValidQuantity = cartItemInformationValidator.validateCartItemInfo({
        quantity: req.body.quantity.toString()
    });

    if (isValidQuantity !== 'pass') {
        return res.status(400).send({
            Error: isValidQuantity
        });
    }

    const quantity = parseInt(req.body.quantity.toString());

    if (quantity <= 0) {
        return res.status(400).send({
            Error: 'Quantity must be more than Zero'
        });
    }

    cartItem.getCartItem(cartItemId).then(retrivedCartItem => {
        store.getStore(retrivedCartItem.storeId).then(storeInfo => {
            console.log(storeInfo);
            warehouse.getProductFromWarehouse(
                storeInfo.warehouse, retrivedCartItem.product
            ).populate({
                path: 'storage.productId'
            }).then(warehouseInfo => {
                // console.log(warehouseInfo);
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
                                res.status(501).send(err);
                            });
                        }).catch(err => {
                            res.status(501).send(err);
                        });
                    }
                }
            }).catch(err => {
                res.status(501).send(err);
            });
        }).catch(err => {
            res.status(404).send({
                error: 'store is not exists'
            });
        });
    });

});

//--------------------checkout Order (place Order)--------------------\\
router.post('/checkout', userAuthenticated, (req, res) => {

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
            Error: isValidOrderInfo
        });
    }

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
                                                                                            res.send(addedOrderToStore);
                                                                                        });
                                                                                    }
                                                                                }).catch(err => {
                                                                                    res.status(404).send(err);
                                                                                });
                                                                        }).catch(err => {
                                                                            res.status(404).send(err);
                                                                        });
                                                                    }).catch(err => {
                                                                        res.status(404).send(err);
                                                                    });
                                                                }).catch(err => {
                                                                    res.status(404).send(err);
                                                                });
                                                            }).catch(err => {
                                                                res.status(404).send(err);
                                                            });
                                                        }).catch(err => {
                                                            res.status(404).send(err);
                                                        });
                                                    }).catch(err => {
                                                        res.status(400).send('There is no available quantity in this store');
                                                    });
                                                }).catch(err => {
                                                    res.status(400).send({
                                                        Error: 'error in updating product'
                                                    });
                                                });
                                            }).catch(err => {
                                                res.status(400).send({
                                                    Error: 'error getting product By Id in updating product'
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
                                                                                    res.send(addedOrderToStore);
                                                                                });
                                                                            }
                                                                        }).catch(err => {
                                                                            res.status(404).send(err);
                                                                        });
                                                                }).catch(err => {
                                                                    res.status(404).send(err);
                                                                });
                                                            }).catch(err => {
                                                                res.status(404).send(err);
                                                            });
                                                        }).catch(err => {
                                                            res.status(404).send(err);
                                                        });
                                                    }).catch(err => {
                                                        res.status(404).send(err);
                                                    });
                                                }).catch(err => {
                                                    res.status(404).send(err);
                                                });
                                            }).catch(err => {
                                                res.status(400).send('There is no available quantity in this store');
                                            });
                                        }
                                    } else {
                                        errors[cart.product] = 'error in quantity of product ' + cart.product + 'there is no available quantity';
                                        res.status(400).send('There is no available quantity in this store');
                                    }
                                }).catch(err => {
                                    return res.status(404).send('There no available quantity in this store');
                                });

                            }).catch(err => {
                                return res.status(404).send('There is no store');
                            });

                        }).catch(err => {
                            res.status(404).send(err);
                        });
                    });
                } else {
                    res.status(400).send({
                        Error: 'You must have at least one cart in your shoppingcart'
                    });
                }
            }).catch(err => {
                res.status(404).send(err);
            });
        } catch (err) {
            res.status(404).send(err);
        }
    } else {
        res.status(403).send({
            Error: 'you cannot access this page'
        });
    }
});

module.exports = router;