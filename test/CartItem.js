process.env.NODE_ENV = 'test';
const ShoppingCart = require('../src/business/ShoppingCart/ShoppingCart');
const expect = require('chai').expect;
const connection = require('../connect');
// var mongoose = require('mongoose');
// var addedCartItemId = mongoose.Types.ObjectId('5ff2711458e25b1b84611b68');

const cartItem = require('../src/business/Objects').CARTITEM;

const shoppingCartId = "5fee1adfcef37314e007dd03";
const addedCartItemId = "5ff2711458e25b1b84611b68";
const cartItemId = "5ff26094fb96cf1ac0b0482f";
const productId = "5fc2dca11796751e3c73829f";
const productPrice = 500;
const quantity = 3;
const date = Date.now();
const storeId = "5ff2484f18a88e286c5f0a8a";

const createdCartItem = {
    product: productId,
    quantity: quantity,
    date: date,
    storeId: storeId,
    shoppingCart: shoppingCartId,
    totalPrice: productPrice * quantity
}; 
let createdCartItemId = null;

//Testing functions
function test(result) {
    expect(result).to.contain.property('_id');
}

describe('CartItem Class Tests', () => {

    before((done) => {
        connection.connect()
            .then(() => done())
            .catch((err) => done(err));
    });

    it('Creating CartItem without errors.', (done) => {
        cartItem.createCartItem(createdCartItem)
            .then(createResult => {
                console.log(createResult);
                test(createResult);
                createdCartItem = createResult._id;
                done();
            })
            .catch(err => done(err));
    });

    // it('should get CartItem', (done) => {
    //     console.log(createdCartItem);
    //     cartItem.getCartItem(createdCartItem)
    //         .then(retrievedCartItem => {
    //             expect(retrievedCartItem.quantity).to.equal(3);
    //             expect(retrievedCartItem.totalPrice).to.equal(1500);
    //             done();
    //         })
    //         .catch(err => done(err));
    // });

    // it('should delete CartItem', (done) => {
    //     cartItem.deleteCartItem(createdCartItem)
    //         .then(deleteResult => {
    //             cartItem.getCartItem(createdCartItem)
    //                 .then(retrievedCartItem => {
    //                     expect(retrievedCartItem).toBe(undefined);
    //                     done();
    //                 })
    //                 .catch(err => done(err));
    //         })
    //         .catch(err => done(err));
    // });

});