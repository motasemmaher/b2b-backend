process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const GARAGEOWNER = require('../src/business/Objects').GARAGEOWNER;

//Needed object IDs
const testingUserId = "5fd89fdf8b5299203ce67b00";
const testingStoreId = "5fd89fdf8b5299203ce67b01";

const existingGarageOwnerId = "5fd89fe08b5299203ce67bc9";
const existingUserId1 = "5fd8a0068b5299203ce67bca";
const existingStoreId1 = "5fd8a0078b5299203ce67bcd";
const existingUserId2 = "5fd89fdf8b5299203ce67bc5";


const waitingUserId1 = "5fe6765c7e8b963820a0a8bc";
const waitingUserId2 = "5fe676697e8b963820a0a8c1";



//Testing functions
function test(result,userId,storeId)
{
    expect(result).to.contain.property('_id');
    expect(result.user._id.toString()).to.equal(userId);
    expect(result.stores.length).to.equal(1);
    if(storeId != null)
        expect(result.stores[0]._id.toString()).to.equal(storeId);
}

describe('GarageOwner Class Tests', () => {    
    
    before((done) => {
      connection.connect()
                .then(() => done())
                .catch((err) => done(err));
    });
  
    it('Creating a garageOwner without errors.', (done) => {
        GARAGEOWNER.createGarageOwner({user:testingUserId,stores:[existingStoreId1]})
        .then(createResult => {
            test(createResult,testingUserId,existingStoreId1);
            GARAGEOWNER.deleteGarageOwnerByUserId(testingUserId)
            .then(deleteResult => {
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Creating a garageOwner with error.', (done) => {
        GARAGEOWNER.createGarageOwner({})
        .then(createResult => done())
        .catch(err => {
            expect(err.message).to.contain("Path `user` is required.");
            done();
        });
    });

    it('Getting waiting users without errors (nolimit&noskip).', (done) => {
        GARAGEOWNER.getWaitingUsers([waitingUserId1,waitingUserId2],0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(2);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting waiting users without errors (limit=1&noskip).', (done) => {
        GARAGEOWNER.getWaitingUsers([waitingUserId1,waitingUserId2],1,0)
        .then(getResult => {
            expect(getResult.length).to.equal(1);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting waiting users without errors (nolimit&skip=1).', (done) => {
        GARAGEOWNER.getWaitingUsers([waitingUserId1,waitingUserId2],0,1)
        .then(getResult => {
            expect(getResult.length).to.equal(1);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting garageOwner users without errors (nolimit&noskip).', (done) => {
        GARAGEOWNER.getAllGarageOwners([existingUserId1,existingUserId2],0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(2);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting garageOwner users without errors (limit=1&noskip).', (done) => {
        GARAGEOWNER.getAllGarageOwners([existingUserId1,existingUserId2],1,0)
        .then(getResult => {
            expect(getResult.length).to.equal(1);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting garageOwner users without errors (nolimit&skip=1).', (done) => {
        GARAGEOWNER.getAllGarageOwners([existingUserId1,existingUserId2],0,1)
        .then(getResult => {
            expect(getResult.length).to.equal(1);
            test(getResult[0],existingUserId1,existingStoreId1);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting garageOwner by user id without errors.', (done) => {
        GARAGEOWNER.getGarageOwnerByUserId(existingUserId1)
        .then(getResult => {
            test(getResult,existingUserId1,existingStoreId1);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting garageOwner by user id (nonExisting user id).', (done) => {
        GARAGEOWNER.getGarageOwnerByUserId(testingUserId)
        .then(getResult => {
            expect(getResult).to.be.null;
            done();
        })
        .catch(err => done(err));
    });

    it('Deleting a garageOwner by user id without errors.', (done) => {
        GARAGEOWNER.createGarageOwner({user:testingUserId,stores:[existingStoreId1]})
        .then(createResult => {
            GARAGEOWNER.deleteGarageOwnerByUserId(testingUserId)
            .then(deleteResult => {
                GARAGEOWNER.getGarageOwnerByUserId(testingUserId)
                .then(getResult => {
                    expect(getResult).to.be.null;
                    done();
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Adding store to list without errors.', (done) => {
        GARAGEOWNER.addStoreToList(existingGarageOwnerId,testingStoreId)
        .then(addResult => {
            GARAGEOWNER.getGarageOwnerByUserId(existingUserId2)
            .then(getResult => {
                expect(getResult.stores.length).to.equal(3);
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Removing store to list without errors.', (done) => {
        GARAGEOWNER.removeStoreFromList(existingGarageOwnerId,testingStoreId)
        .then(removeResult => {
            GARAGEOWNER.getGarageOwnerByUserId(existingUserId2)
            .then(getResult => {
                expect(getResult.stores.length).to.equal(2);
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });
   
    it('Trusting user without errors.', (done) => {
        GARAGEOWNER.createGarageOwner({user:testingUserId,stores:[existingStoreId1]})
        .then(createResult => {
            GARAGEOWNER.trustGarageOwner(createResult._id)
            .then(trustResult => {
                GARAGEOWNER.getGarageOwner(trustResult._id)
                .then(getResult => {
                    expect(getResult.isTrusted).to.be.true;
                    GARAGEOWNER.deleteGarageOwnerByUserId(testingUserId)
                    .then(deleteResult => {
                        done();
                    })  
                    .catch(err => done(err));
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

});