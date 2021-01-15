process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const MENU = require('../src/business/Objects').MENU;

const existingStoreId = "5fd89fe08b5299203ce67bc8";
const testingStoreId = "5fd89fe08b5299203ce67b01";
const testingCategoryId1 = "5fd89fe08b5299203ce67b02";
const testingCategoryId2 = "5fd89fe08b5299203ce67b03";


function testUpdated(menuId,storeId,categoryId1,categoryId2)
{
  const getPromiseResult = MENU.getMenu(menuId);
  getPromiseResult.then(getResult => {
    expect(getResult.storeId.toString()).to.equals(storeId);  
    expect(getResult.categories.length).to.equals(2);  
    expect(getResult.categories[0].toString()).to.equals(categoryId1);
    expect(getResult.categories[1].toString()).to.equals(categoryId2);
  });
}

function testDeleted(menuId)
{
  const getPromiseResult = MENU.getMenu(menuId);
  getPromiseResult.then(getResult => {
      expect(getResult).to.be.null;
  });
}

describe('Menu Class Tests', () => {    
     
    before((done) => {
      connection.connect()
                .then(() => done())
                .catch((err) => done(err));
    });
  
    it('Creating menu without errors.', (done) => {
      MENU.createMenu()
      .then(createResult => {
      expect(createResult).to.contain.property('_id');
      MENU.deleteMenu(createResult._id)
        .then(deleteResult => {
        done();
        })
        .catch(err => done(err));
      })
      .catch(err => done(err));
    });

    it('Linking menu without errors.', (done) => {
        MENU.createMenu()
        .then(createResult => {
        MENU.linkMenu({_id:createResult._id,storeId:testingStoreId})
            .then(linkingResult => {
            MENU.getMenu(linkingResult._id)
                .then(getResult => {
                    expect(getResult.storeId.toString()).to.equal(testingStoreId);
                    MENU.deleteMenu(getResult._id)
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

    it('Updating menu without errors.', (done) => {
        MENU.createMenu()
        .then(createResult => {
            MENU.linkMenu({_id:createResult._id,storeId:testingStoreId})
            .then(linkingResult => {
                MENU.updateMenu({storeId:testingStoreId,categories:[testingCategoryId1,testingCategoryId2]})
                .then(updateResult => {
                    testUpdated(updateResult._id,testingStoreId,testingCategoryId1,testingCategoryId2);
                    MENU.deleteMenu(updateResult._id)
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

    it('Deleting menu without errors.', (done) => {
        MENU.createMenu()
        .then(createResult => {
        MENU.deleteMenu(createResult._id)
          .then(deleteResult => {
          testDeleted(deleteResult._id);
          done();
          })
          .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Adding category to a menu without errors.', (done) => {
        MENU.createMenu()
        .then(createResult => {
            MENU.linkMenu({_id:createResult._id,storeId:testingStoreId})
            .then(linkingResult => {        
                MENU.addCategory(testingStoreId,testingCategoryId1)
                .then(addResult => {
                    MENU.getMenu(addResult._id)
                    .then(getResult => {
                        expect(getResult.categories.length).to.equal(1);
                        MENU.deleteMenu(getResult._id)
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
        })
        .catch(err => done(err));
    });

    it('Getting categories of menu without errors.', (done) => {
        MENU.getAllCategories(existingStoreId)
        .then(getResult => {
            expect(getResult.categories.length).to.equal(2);
            done();
        })
        .catch(err => done(err));
    });

    it('Deleting menu by store ID without errors.', (done) => {
        MENU.createMenu()
        .then(createResult => {
            MENU.linkMenu({_id:createResult._id,storeId:testingStoreId})
            .then(linkingResult => {        
                MENU.deleteMenuByStoreId(testingStoreId)
                .then(deleteResult => {
                    testDeleted(deleteResult._id);
                    done();
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

});