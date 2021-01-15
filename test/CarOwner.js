process.env.NODE_ENV = 'test';
const CarOwner = require('../src/business/CarOwner/CarOwner');
const expect = require('chai').expect;
const connection = require('../connect');

const carOwner = new CarOwner();

//Carowner information
let carOwnerId = "5fd866fe6add9a31e0779908";
let userId = "5fd866fb6add9a31e0779905";
let carId = "5fd866fc6add9a31e0779906";
let otherCarId = "5fd87fd55fc4e8351c158dff";
let shoppingCartId = "5fd866fd6add9a31e0779907";



//Testing functions
function test(result,userId,carId,shoppingCart,get)
{
    resultCarOwnerId = result._id.toString();
    resultUserId = result.user._id.toString();
    resultCarId = result.cars[0]._id.toString();
    resultShoppingCartId = result.shoppingCart.toString();

    expect(result).to.contain.property('_id');
    if(get)
        expect(resultCarOwnerId).to.equal(carOwnerId);
    expect(resultUserId).to.equal(userId);
    expect(resultCarId).to.equal(carId);
    expect(resultShoppingCartId).to.equal(shoppingCart);
}


describe('CarOwner Class Tests', () => {    
    
    before((done) => {
      connection.connect()
                .then(() => done())
                .catch((err) => done(err));
    });
  
    it('Creating car owner without errors.', (done) => {
      carOwner.createCarOwner({user:userId,cars:[carId],shoppingCart:shoppingCartId})
      .then(carOwnerResult => {
        test(carOwnerResult,userId,carId,shoppingCartId);
        carOwner.deleteCarOwner(carOwnerResult._id)
        .then(deleteResult => {
            done();
        })
        .catch(err => done(err));
      })
      .catch(err => done(err));
    });

    it('Getting car owner by user id without errors.', (done) => {
        carOwner.getCarOwnerByUserId(userId)
        .then(carOwnerResult => {
          test(carOwnerResult,userId,carId,shoppingCartId,true);
          done();
        })
        .catch(err => done(err));
      });

    it('Getting all car owners without errors (nolimit&noskip).', (done) => {
        carOwner.getAllCarOwners(0,0)
        .then(getAllResult => {
          expect(getAllResult.length).to.equal(2);
          done();
        })
        .catch(err => done(err));
    });

    it('Getting all car owners without errors (limit=1&noskip).', (done) => {
        carOwner.getAllCarOwners(1,0)
        .then(getAllResult => {
          expect(getAllResult.length).to.equal(1);
          done();
        })
        .catch(err => done(err));
    });

    it('Getting all car owners without errors (nolimit&skip=1).', (done) => {
        carOwner.getAllCarOwners(0,1)
        .then(getAllResult => {
            test(getAllResult[0],"5fd87fd45fc4e8351c158dfe",otherCarId,"5fd87fd55fc4e8351c158e00");
            expect(getAllResult.length).to.equal(1);
            done();
        })
        .catch(err => done(err));
    });

    it("Adding car to car owner's list without errors ", (done) => {
        carOwner.addCarToList(carOwnerId,otherCarId)
        .then(addResult => {
        carOwner.getCarOwnerByUserId(userId)
            .then(getResult => {
            expect(getResult.cars.length).to.equal(2);
            done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it("Removing car to car owner's list without errors ", (done) => {
        carOwner.removeCarFromList(carOwnerId,otherCarId)
        .then(removeResult => {
        carOwner.getCarOwnerByUserId(userId)
            .then(getResult => {
            expect(getResult.cars.length).to.equal(1);
            done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });
 
});