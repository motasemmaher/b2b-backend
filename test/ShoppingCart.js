process.env.NODE_ENV = 'test';
const ShoppingCart = require('../src/business/ShoppingCart/ShoppingCart');
const expect = require('chai').expect;
const connection = require('../connect');

const shoppingCart = new ShoppingCart();

//Testing functions
function test(result)
{
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
});