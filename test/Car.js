process.env.NODE_ENV = 'test';
const Car = require('../src/business/Car/Car');
const expect = require('chai').expect;
const connection = require('../connect');

const car = new Car();

let existingCarId = "5fd866fc6add9a31e0779906";

//Valid car data
let make="BMW"; 
let model="X6";
let year="2020";
//Valid update data
let updatedMake="Honda"; 
let updatedModel="Civic";
let updatedYear="2010";

//Invalid Make Data
let shortMake="M"; 
let longMake = new Array(65).join('M');
let invalidFormatMake = "LLL@LLL"; 

//Invalid Model Data
let shortModel="M";
let longModel = new Array(65).join('M');
let invalidFormatModel = "LLL@LLL";

//Invalid Year Data
let oldYear="1884";
let futureYear="2222";
let invalidFormatYear = "YYYY";

//Testing functions
function test(result,make,model,year)
{
    expect(result).to.contain.property('_id');
    expect(result).to.contain.property('model').to.equal(model);
    expect(result).to.contain.property('make').to.equal(make);
    expect(result).to.contain.property('year').to.equal(year);
}

function testUpdated(carId,make,model,year)
{
    const getCarPromiseResult = car.getCar(carId);
    getCarPromiseResult.then(getResult => {test(getResult,make,model,year)});
}

function testDeleted(carId)
{
  const getCarPromiseResult = car.getCar(carId);
  getCarPromiseResult.then(getResult => {
      expect(getResult).to.be.null;
  });
}

describe('Car Class Tests', () => {    

  before((done) => {
    connection.connect()
              .then(() => done())
              .catch((err) => done(err));
  });

  it('Validating car information without errors.', (done) => {
    const validationResult = car.validateCarInfo({make:make,model:model,year:year});
    expect(validationResult).to.be.undefined;
    done();
  });

  it('Validating car information invalid make (short).', (done) => {
    const validationResult = car.validateCarInfo({make:shortMake,model:model,year:year});
    expect(validationResult.err).to.contain("make");
    done();
  });

  it('Validating car information invalid make (long).', (done) => {
    const validationResult = car.validateCarInfo({make:longMake,model:model,year:year});
    expect(validationResult.err).to.contain("make");
    done();
  });

  it('Validating car information invalid make (format).', (done) => {
    const validationResult = car.validateCarInfo({make:invalidFormatMake,model:model,year:year});
    expect(validationResult.err).to.contain("make");
    done();
  });

  it('Validating car information invalid model (short).', (done) => {
    const validationResult = car.validateCarInfo({make:make,model:shortModel,year:year});
    expect(validationResult.err).to.contain("model");
    done();
  });

  it('Validating car information invalid model (long).', (done) => {
    const validationResult = car.validateCarInfo({make:make,model:longModel,year:year});
    expect(validationResult.err).to.contain("model");
    done();
  });
  
  it('Validating car information invalid model (format).', (done) => {
    const validationResult = car.validateCarInfo({make:make,model:invalidFormatModel,year:year});
    expect(validationResult.err).to.contain("model");
    done();
  });

  it('Validating car information invalid year (future).', (done) => {
    const validationResult = car.validateCarInfo({make:make,model:model,year:futureYear});
    expect(validationResult.err).to.contain("year");
    done();
  });

  it('Validating car information invalid year (too old).', (done) => {
    const validationResult = car.validateCarInfo({make:make,model:model,year:oldYear});
    expect(validationResult.err).to.contain("year");
    done();
  });

  it('Validating car information invalid year (format).', (done) => {
    const validationResult = car.validateCarInfo({make:make,model:model,year:invalidFormatYear});
    expect(validationResult.err).to.contain("year");
    done();
  });

  it('Checking if the car exists without errors.', (done) => {
    car.exists(existingCarId)
    .then(getResult => {
    expect(getResult).to.be.true;
    done();
    })
    .catch(err => done(err));
  });

  it('Getting car by id without errors.', (done) => {
    car.createCar({make:make,model:model,year:year})
    .then(carResult => {
    car.getCar(carResult._id)
      .then(getResult => {
      test(carResult,make,model,year);
      car.deleteCar(carResult._id)
        .then(deleteResult => {
        done();
        })
        .catch(err => done(err));
      })
      .catch();
    })
    .catch(err => done(err));
  });

  it('Creating car without errors.', (done) => {
    car.createCar({make:make,model:model,year:year})
    .then(carResult => {
      test(carResult,make,model,year);
      car.deleteCar(carResult._id)
      .then(deleteResult => {
        done();
      })
      .catch(err => done(err));
    })
    .catch(err => done(err));
  });

  it('Updating car without errors.', (done) => {
    car.createCar({make:make,model:model,year:year})
    .then(createResult => {
      carId = createResult._id;
      car.updateCar({_id:carId,make:updatedMake,model:updatedModel,year:updatedYear})
      .then(updateResult => {
        test(updateResult,make,model,year);
        testUpdated(carId,updatedMake,updatedModel,updatedYear);
        car.deleteCar(carId)
        .then(deleteResult => {
          done();
        })
        .catch(err => done(err))
      })
      .catch(err => done(err));
    })
    .catch(err => done(err));
  });

  it('Deleting car without errors.', (done) => {
    car.createCar({make:make,model:model,year:year})
    .then(createResult => {
      carId = createResult._id;
      car.deleteCar({_id:carId})
      .then(updateResult => {
        test(updateResult,make,model,year);
        testDeleted(carId);
        done();
      })
      .catch(err => done(err));
    })
    .catch(err => done(err));
  });
  
});