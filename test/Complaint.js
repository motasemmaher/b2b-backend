process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const COMPLAINT = require('../src/business/Objects').COMPLAINT;

const messageId = "5fe3d2968100f92be07e4f5d";
const submitterId = "5fd866fb6add9a31e0779905";
const garageOwnerId = "5fd89fdf8b5299203ce67bc5";
const garageId = "5fd89fe08b5299203ce67bc8";
const complaintId = "5fe3d2968100f92be07e4f5e";

//Testing functions
function test(result,submitterId,garageOwnerId,garageId,message,messageId)
{
    expect(result).to.contain.property('_id');
    expect(result.submitterId._id.toString()).to.equal(submitterId);
    expect(result.garageOwnerId._id.toString()).to.equal(garageOwnerId);
    expect(result.garageId._id.toString()).to.equal(garageId);
    if(messageId == null)
        expect(result.message.data).to.equal(message);
    else
        expect(result.message.toString()).to.equal(messageId);
}

describe('Complaint Class Tests', () => {    
    
    before((done) => {
      connection.connect()
                .then(() => done())
                .catch((err) => done(err));
    });

    it('Creating a complaint without errors.', (done) => {
        COMPLAINT.createComplaint(submitterId,messageId,garageOwnerId,garageId)
        .then(createResult => {
          test(createResult,submitterId,garageOwnerId,garageId,null,messageId);
          COMPLAINT.deleteComplaint(createResult._id)
          .then(deleteResult => {
            done();
          })
          .catch(err => done(err))
        })
        .catch(err => done(err))
    });

    it('Count all complaints without errors.', (done) => {
      COMPLAINT.countAllComplaints()
      .then(countResult => {
      expect(countResult).to.equal(4);
      done();
      })
      .catch(err => done(err))
    });
  
    it('Count garageOner complaints without errors.', (done) => {
        COMPLAINT.countByGarageOwner(garageOwnerId)
        .then(countResult => {
        expect(countResult).to.equal(3);
        done();
        })
        .catch(err => done(err))
    });

    it('Getting all complaints without errors (nolimit&noskip).', (done) => {
        COMPLAINT.getAllComplaints(0,0)
        .then(getResult => {
        expect(getResult.length).to.equal(4);
        done();
        })
        .catch(err => done(err))
    });

    it('Getting all complaints without errors (limit=1&noskip).', (done) => {
        COMPLAINT.getAllComplaints(1,0)
        .then(getResult => {
        expect(getResult.length).to.equal(1);
        done();
        })
        .catch(err => done(err))
    });

    it('Getting all complaints without errors (nolimit&skip=1).', (done) => {
        COMPLAINT.getAllComplaints(0,1)
        .then(getResult => {
        //test(getResult[0],submitterId,"5fd8a0068b5299203ce67bca","5fd8a0078b5299203ce67bcd","This is testing message 4.",null);
        expect(getResult.length).to.equal(3);
        done();
        })
        .catch(err => done(err))
    });
    
    it('Getting garageOwners complaints without errors (nolimit&noskip).', (done) => {
        COMPLAINT.getGarageOwnerComplaints(garageOwnerId,0,0)
        .then(getResult => {
        expect(getResult.length).to.equal(3);
        done();
        })
        .catch(err => done(err))
    });

    it('Getting garageOwners complaints without errors (limit=1&noskip).', (done) => {
        COMPLAINT.getGarageOwnerComplaints(garageOwnerId,1,0)
        .then(getResult => {
        
        expect(getResult.length).to.equal(1);
        done();
        })
        .catch(err => done(err))
    });

    it('Getting garageOwners complaints without errors (nolimit&skip=1).', (done) => {
        COMPLAINT.getGarageOwnerComplaints(garageOwnerId,0,1)
        .then(getResult => {
        test(getResult[0],submitterId,garageOwnerId,garageId,"This is testing message 2.",null);
        expect(getResult.length).to.equal(2);
        done();
        })
        .catch(err => done(err))
    });

    it('Getting a complaint by id without errors.', (done) => {
        COMPLAINT.getComplaint(complaintId)
        .then(getResult => {
        test(getResult,submitterId,garageOwnerId,garageId,"This is testing message 1.",null);
        done();
        })
        .catch(err => done(err))
    });

    it('Getting a complaint by id (non existing id)).', (done) => {
        COMPLAINT.getComplaint("5fe3d2968100f92be07e4f00")
        .then(getResult => {
        expect(getResult).to.be.null;
        done();
        })
        .catch(err => done(err))
    });
   
});