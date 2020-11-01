process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../../index'); 
const conn = require('../../../connect');
const mongoose = require('mongoose');
const CarModel = require('../../../src/models/model/Car');

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
