process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../index'); 
const connection = require('../../../connect');
const mongoose = require('mongoose');
const CarModel = require('../../../src/models/model/Car');

userId="USERID: 2"; model="BMW"; make="X6"; year=2022;

function test(result,userId,model,make,year)
{
    expect(result).to.contain.property('_id');
    expect(result).to.contain.property('userId').to.equal(userId);
    expect(result).to.contain.property('model').to.equal(model);
    expect(result).to.contain.property('make').to.equal(make);
    expect(result).to.contain.property('year').to.equal(''+year);
}

function testDeleted(id)
{
  const getCarPromiseResult = CarModel.getCar(id);
  getCarPromiseResult.then(getResult => {
      expect(getResult).to.be.null;
  });
}

function testUpdated(id,userId,model,make,year)
{
    const getCarPromiseResult = CarModel.getCar(id);
    getCarPromiseResult.then(getResult => {test(getResult,userId,model,make,year)});
}

describe('Database Car tests', () => {    

  before((done) => {
    connection.connect()
              .then(() => done())
              .catch((err) => done(err));
  });

  it('Creating car without errors.', done => {
    CarModel.deleteAllCars();
    const createCarPromiseResult = CarModel.createCar({ userId:userId,model:model,make:make,year:year });
    createCarPromiseResult.then(createResult => {
      test(createResult,userId,model,make,year);
      done();
    });
  })

  
  it('Updating car without errors.', done => {
    oldUserId="(To be updated) USERID: 99"; oldModel="(To be updated ) BMW"; oldMake="(To be updated ) X6"; oldYear=2098;
    const createCarPromiseResult = CarModel.createCar({ userId:oldUserId,model:oldModel,make:oldMake,year:oldYear });

    createCarPromiseResult.then(createResult => { 
        carId = createResult._id;
        userId="(UPDATED) USERID: 99"; model="(UPDATED) BMW"; make="(UPDATED) X6"; year=2099;
        
        const updateCarPromiseResult = CarModel.updateCar({ _id:carId,userId:userId,model:model,make:make,year:year });
        updateCarPromiseResult.then( updateResult => {
          test(updateResult,oldUserId,oldModel,oldMake,oldYear);
          testUpdated(carId,userId,model,make,year);
          done();
        });
     });
  });

  
  it('deleting car without errors.', done => {
  
    userId="(To be deleted) USERID: 100"; model="(To be deleted ) BMW"; make="(To be deleted ) X6"; year=2100;
    
    const createCarPromiseResult = CarModel.createCar({ userId:userId,model:model,make:make,year:year });
    createCarPromiseResult.then(createResult => { 
        carId = createResult._id;
        const deleteCarPromiseResult = CarModel.deleteCar({ _id:carId});
        
        deleteCarPromiseResult.then( deleteResult => {
          test(deleteResult,userId,model,make,year);
          testDeleted(carId);
          done();
        });
     });
  });

});


/*
API Testing

describe('POST createCar', () => {    
  
    before((done) => {
      conn.connect()
          .then(() => done())
          .catch((err) => done(err));
    });

    it('Success.Creating a new car works.', done => {

      CarModel.deleteAllCars();
      request(app).post('/create-car')
      .send({ userId:"USERID: 2",model:"BMW",make:"X6",year:2022 })
      .then ((result) => {
        const body = result.body;
        expect(body).to.contain.property('_id');
        expect(body).to.contain.property('userId');
        expect(body).to.contain.property('model');
        expect(body).to.contain.property('make');
        expect(body).to.contain.property('year');
        done();
      })
    });
    
  });
*/




