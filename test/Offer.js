process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const OFFER = require('../src/business/Objects').OFFER;

//Needed Object IDs
const existingOfferId = "5fe903b449f4855a38a00725";
const nonExistingOfferId = "5fe903b449f4855a38a00700";

//Valid offer data
validDiscountRate = 30;
validDuration = 5;
validNewPrice = 20.5;

//Invalid offer data
downRangeDiscountRate = -5;
upRangeDiscountRate = 101;
invalidDiscountRateType = "invalidDiscountType";
downRangeDuration = -20;
upRangeDuration = 1000;
invalidDurationType = "invalidDurationType";
invalidNewPrice = "invalidNewPrice";

function prepareData(discountRate,duration,newPrice)
{
    return {discountRate,duration,newPrice};
}
//Testing functions
function test(result,discountRate,duration,newPrice)
{
    expect(result).to.contain.property('_id');
    expect(result).to.contain.property('discountRate').to.equal(discountRate);
    expect(result).to.contain.property('duration').to.equal(duration);
    expect(result).to.contain.property('newPrice').to.equal(newPrice);
    expect(result).to.contain.property('expirationDate');
}

describe('Offer Class Tests', () => {    
    
    before((done) => {
      connection.connect()
                .then(() => done())
                .catch((err) => done(err));
    });
  
    it('Validating offer information without errors.', (done) => {
        const data = prepareData(validDiscountRate,validDiscountRate,validNewPrice);
        const validationResult = OFFER.validateOfferInfo(data);
        expect(validationResult).to.be.undefined;
        done();
    });
/*
    it('Validating offer information invalid discount rate (downRange).', (done) => {
        const data = prepareData(downRangeDiscountRate,validDuration,validNewPrice);
        const validationResult = OFFER.validateOfferInfo(data);
        expect(validationResult.err).to.contain("Invalid offer discountRate !");
        done();
    });

    it('Validating offer information invalid discount rate (upRange).', (done) => {
        const data = prepareData(upRangeDiscountRate,validDuration,validNewPrice);
        const validationResult = OFFER.validateOfferInfo(data);
        expect(validationResult.err).to.contain("Invalid offer discountRate !");
        done();
    });

    it('Validating offer information invalid discount rate (invalidType).', (done) => {
        const data = prepareData(invalidDiscountRateType,validDuration,validNewPrice);
        const validationResult = OFFER.validateOfferInfo(data);
        expect(validationResult.err).to.contain("Invalid offer discountRate !");
        done();
    });

    it('Validating offer information invalid discount rate (missing).', (done) => {
        const validationResult = OFFER.validateOfferInfo({duration:validDuration,newPrice:validNewPrice});
        expect(validationResult.err).to.contain("Invalid offer discountRate !");
        done();
    });

    it('Validating offer information invalid duration (downRange).', (done) => {
        const data = prepareData(validDiscountRate,downRangeDuration,validNewPrice);
        const validationResult = OFFER.validateOfferInfo(data);
        expect(validationResult.err).to.contain("Invalid offer duration !");
        done();
    });

    it('Validating offer information invalid duration (upRange).', (done) => {
        const data = prepareData(validDiscountRate,upRangeDuration,validNewPrice);
        const validationResult = OFFER.validateOfferInfo(data);
        expect(validationResult.err).to.contain("Invalid offer duration !");
        done();
    });

    it('Validating offer information invalid duration (invalidType).', (done) => {
        const data = prepareData(validDiscountRate,invalidDurationType,validNewPrice);
        const validationResult = OFFER.validateOfferInfo(data);
        expect(validationResult.err).to.contain("Invalid offer duration !");
        done();
    });

    it('Validating offer information invalid duration (missing).', (done) => {
        const data = prepareData(validDiscountRate,undefined,validNewPrice);
        const validationResult = OFFER.validateOfferInfo(data);
        expect(validationResult.err).to.contain("Invalid offer duration !");
        done();
    });

    it('Validating offer information invalid new price (invalidType).', (done) => {
        const data = prepareData(validDiscountRate,validDuration,invalidNewPrice);
        const validationResult = OFFER.validateOfferInfo(data);
        expect(validationResult.err).to.contain("Invalid offer newPrice !");
        done();
    });

    it('Validating offer information invalid newPrice (missing).', (done) => {
        const data = prepareData(validDiscountRate,validDuration);
        const validationResult = OFFER.validateOfferInfo(data);
        expect(validationResult.err).to.contain("Invalid offer newPrice !");
        done();
    });

    it('Checking if the offer exists without errors.', (done) => {
        OFFER.exists(existingOfferId)
        .then(existResult => {
            expect(existResult).to.be.true;
            done();
        })
        .catch(err => done(err));
    });

    it('Checking if the offer exists without errors. (non-existing offer)', (done) => {
        OFFER.exists(nonExistingOfferId)
        .then(existResult => {
            expect(existResult).to.be.false;
            done();
        })
        .catch(err => done(err));
    });

    it('Creating offer without errors.', (done) => {
        OFFER.createOffer(validDiscountRate,validDuration,validNewPrice)
        .then(createResult => {
            test(createResult,validDiscountRate,validDuration,validNewPrice);
            OFFER.deleteOffer(createResult._id)
            .then(deleteResult => {
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Creating offer with errors. (invalid discount type)', (done) => {
        OFFER.createOffer("invalidDiscountRateType",validDuration,validNewPrice)
        .then(createResult => {
            done();
        })
        .catch(err => {
            expect(err.message).to.contain("Cast to Number failed");
            done();
        });
    });

    it('Deleting offer without errors.', (done) => {
        OFFER.createOffer(validDiscountRate,validDuration,validNewPrice)
        .then(createResult => {
            test(createResult,validDiscountRate,validDuration,validNewPrice);
            OFFER.deleteOffer(createResult._id)
            .then(deleteResult => {
                OFFER.exists(deleteResult._id)
                .then(existResult => {
                    expect(existResult).to.be.false;
                    done();
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });
    */
}); 