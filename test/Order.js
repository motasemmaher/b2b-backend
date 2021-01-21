process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const order = require('../src/business/Objects').ORDER;

const shoppingCartId = "5ffa0c83d261072220d18cd0";
const deliveryAddress = "Amman";
const phoneNumber = '0784563210';
const carOwnerId = "5fee1ae0cef37314e007dd04";
const date = Date.now();
const status = "pending";
const storeId = "5ff2484f18a88e286c5f0a8a";

const limit = 1,
    skip = 0;

const createdOrder = {
    shoppingCart: shoppingCartId,
    deliveryAddress: deliveryAddress,
    phoneNumber: phoneNumber,
    carOwnerId: carOwnerId,
    date: date,
    status: status,
    storeId: storeId
};

const updatedPhoneNumber = "0791236549";
const updatedDeliveryAddress = "Irbid";

let createdOrderId = null;

//Testing functions
function test(result) {
    expect(result).to.contain.property('_id');
}

describe('Order Class Tests', () => {

    before((done) => {
        connection.connect()
            .then(() => done())
            .catch((err) => done(err));
    });

    it('Creating Order without errors.', (done) => {
        order.createOrder(createdOrder)
            .then(createResult => {
                test(createResult);
                createdOrderId = createResult._id;
                done();
            })
            .catch(err => done(err));
    });

    it('get Order without errors.', (done) => {
        order.getOrder(createdOrderId)
            .then(retrievedOrder => {
                test(retrievedOrder);
                done();
            })
            .catch(err => done(err));
    });

    it('update Order without errors.', (done) => {
        const updatedOrder = {
            _id: createdOrderId,
            shoppingCart: shoppingCartId,
            deliveryAddress: updatedDeliveryAddress,
            phoneNumber: updatedPhoneNumber,
            carOwnerId: carOwnerId,
            date: date,
            status: status,
            storeId: storeId
        };
        order.updateOrder(updatedOrder)
            .then(retrievedUpdatedOrder => {
                expect(retrievedUpdatedOrder.phoneNumber).to.equal(updatedPhoneNumber);
                expect(retrievedUpdatedOrder.deliveryAddress).to.equal(updatedDeliveryAddress);
                done();
            })
            .catch(err => done(err));
    });

    // it('get Car Owner By OrderId Order without errors.', (done) => {
    //     order.getCarOwnerByOrderId(createdOrderId)
    //         .then(createResult => {
    //             expect(createResult.carOwnerId).to.equal(carOwnerId);
    //             done();
    //         })
    //         .catch(err => done(err));
    // });

    it('get Order By Car Owner Id without errors.', (done) => {
        order.getOrderByCarOwnerId(carOwnerId, limit, skip)
            .then(createResult => {
                createResult.forEach(element => {
                    expect(element.carOwnerId.toString()).to.equal(carOwnerId); 
                });                
                done();
            })
            .catch(err => done(err));
    });

    it('get Order By Store Id without errors.', (done) => {
        order.getOrdersByStoreId(storeId, limit, skip)
            .then(createResult => {
                createResult.forEach(element => {
                    expect(element.storeId.toString()).to.equal(storeId); 
                });                
                done();
            })
            .catch(err => done(err));
    });

    it('get Order By Store Id And Status without errors.', (done) => {
        order.getOrdersByStoreIdAndStatus(storeId, status, limit, skip)
            .then(createResult => {
                createResult.forEach(element => {
                    expect(element.storeId.toString()).to.equal(storeId);
                    expect(element.status).to.equal(status);
                });                
                done();
            })
            .catch(err => done(err));
    });
    
    it('delete Order without errors.', (done) => {
        order.deleteOrder(createdOrderId)
            .then(deletedOrder => {
                order.getOrder(deletedOrder._id)
                    .then(retrievedOrder => {
                        expect(retrievedOrder).to.equal(null);
                        done();
                    })
                    .catch(err => done(err));
                done();
            })
            .catch(err => done(err));
    });
    
});