process.env.NODE_ENV = 'test';
const ShoppingCart = require('../src/business/ShoppingCart/ShoppingCart');
const expect = require('chai').expect;
const connection = require('../connect');
// var mongoose = require('mongoose');
// var addedCartItemId = mongoose.Types.ObjectId('5ff2711458e25b1b84611b68');

const shoppingCart = require('../src/business/Objects').SHOPPINGCART;

const shoppingCartId = "5fee1adfcef37314e007dd03";
const addedCartItemId = "5ff2711458e25b1b84611b68";
const cartItemId = "5ff26094fb96cf1ac0b0482f";

//Testing functions
function test(result) {
    expect(result).to.contain.property('_id');
}

describe('ShoppingCart Class Tests', () => {    
    
    before((done) => {
        connection.connect()
            .then(() => done())
            .catch((err) => done(err));
    });
/*
    it('Creating shoppingcart without errors.', (done) => {
        shoppingCart.createShoppingCart()
            .then(createResult => {
                test(createResult);
                shoppingCart.deleteShoppingCart(createResult._id)
                    .then(deleteResult => {
                        done();
                    })
                    .catch(err => done(err));
            })
            .catch(err => done(err));
    });
    /*
        it('Deleting shoppingcart without errors.', (done) => {
            shoppingCart.createShoppingCart()
            .then(createResult => {
                shoppingCart.deleteShoppingCart(createResult._id)
                .then(deleteResult => {
                    test(deleteResult);
                    done();
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        });
       */
  /*
       it('should get ShoppingCart', (done) => {
        shoppingCart.getShoppingCart(shoppingCartId)
            .then(retrievedShoppingCart => {
                expect(retrievedShoppingCart.Items).to.be.an('array').that.includes(cartItemId);
                expect(retrievedShoppingCart.totalBill).to.equal(1500);
                done();
            })
            .catch(err => done(err));
    });

    it('should update ShoppingCart', (done) => {
        shoppingCart.updateShoppingCart({
                _id: shoppingCartId
            }).then(updatedShoppingCart => {
                expect(updatedShoppingCart.Items).to.be.an('array')
                done();
            })
            .catch(err => done(err));
    });

    it('should add Cart Item to ShoppingCart', (done) => {
        shoppingCart.addCartItem(shoppingCartId, addedCartItemId).then(updatedShoppingCart => {
                expect(updatedShoppingCart.totalBill).to.equal(3000);
                done();
            })
            .catch(err => done(err));
    });

    it('should remove Cart Item from ShoppingCart', (done) => {
        shoppingCart.removeCartItem(shoppingCartId, addedCartItemId).then(removedCartItem => {
                expect(removedCartItem.totalBill).to.equal(1500);
                done();
            })
            .catch(err => done(err));
    });

    it('should remove all Cart Items from ShoppingCart', (done) => {
        shoppingCart.removeAllCartItem(shoppingCartId).then(removedAllCartItems => {
                expect(removedAllCartItems.totalBill).to.equal(0);
                shoppingCart.addCartItem(shoppingCartId, cartItemId).then(updatedShoppingCart => {
                        done();
                    })
                    .catch(err => done(err));
            })
            .catch(err => done(err));
    });
*/
});