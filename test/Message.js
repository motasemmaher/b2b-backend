process.env.NODE_ENV = 'test';
const Message = require('../src/business/Message/Message');
const expect = require('chai').expect;
const connection = require('../connect');

const message = new Message();

//Valid data
let owner = "5fd866fb6add9a31e0779905";
let data = "This is an example for valid data.";
//Invalid data
let invalidMessageId = "5fd866fb6add9a31e0779905";
let invalidData = "a";

//Testing functions
function test(result,owner,data)
{
    expect(result).to.contain.property('_id');
    expect(result).to.contain.property('owner').to.equal(owner);
    expect(result).to.contain.property('data').to.equal(data);
}

describe('Message Class Tests', () => {    
     
    before((done) => {
      connection.connect()
                .then(() => done())
                .catch((err) => done(err));
    });
  
    it('Validating message information without errors.', (done) => {
        const validationResult = message.validateMessageInfo({data:data});
        expect(validationResult).to.be.undefined;
        done();
    });

    it('Validating message information with invalid data.', (done) => {
        const validationResult = message.validateMessageInfo({data:invalidData});
        expect(validationResult.error).to.contain("data");
        done();
    });

    it('Validating message information with invalid data (missing).', (done) => {
        const validationResult = message.validateMessageInfo({data:undefined});
        expect(validationResult.error).to.contain("data");
        done();
    });

    it('Creating message without errors.', (done) => {
      message.createMessage(owner,data)
      .then(createResult => {
          test(createResult,owner,data);
          message.deleteMessage(createResult._id)
          .then(deleteResult => {
              done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
    });

    it('Creating message invalid data.', (done) => {
        message.createMessage(owner,invalidData)
        .then(createResult => {
            done();
        })
        .catch(err => {
            expect(err.message).to.contain("shorter");
            done();
        });
      });

    it('Deleting message without errors.', (done) => {
        message.createMessage(owner,data)
        .then(createResult => {
            message.deleteMessage(createResult._id)
            .then(deleteResult => {
                test(deleteResult,owner,data);
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Deleting message invalid message ID error.', (done) => {
        message.deleteMessage(invalidMessageId)
        .then(deleteResult => {
            expect(deleteResult).to.be.null;
            done();
        })
        .catch(err => done(err));
    });
  
}); 