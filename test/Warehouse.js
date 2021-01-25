process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const warehouse = require('../src/business/Objects').WAREHOUSE;


//Carowner information
let warehouseId = "5fd89fdf8b5299203ce67bc7";
let storeId = "5fd89fe08b5299203ce67bc8";
let categoryId = "5fd8a0ff8b5299203ce67bd2";



let testingCategoryId = "5fd8a0ff8b5299203ce67b00";
let testingProduct = "5fd8a2608b5299203ce67b00";
let testingStoreId = "5fd9af52fdac372044c3aa00";

let deleteStoreId = "5fd9af52fdac372044c3aa01";


describe('Warehouse Class Tests', () => {    
    
    before((done) => {
      connection.connect()
                .then(() => done())
                .catch((err) => done(err));
    });

    it('Validating warehouse information without errors.', (done) => {
        const validationResult = warehouse.validateWarehouseInfo({amount:1111});
        expect(validationResult).to.be.undefined;
        done();
    });

    it('Validating warehouse information invalid amount (format).', (done) => {
        const validationResult = warehouse.validateWarehouseInfo({amount:"11a1"});
        expect(validationResult.error).to.contain("amount");
        done();
    });

    it('Validating warehouse information invalid amount (length).', (done) => {
        const validationResult = warehouse.validateWarehouseInfo({amount:11111});
        expect(validationResult.error).to.contain("amount");
        done();
    });

    it('Validating warehouse information invalid amount (missing).', (done) => {
        const validationResult = warehouse.validateWarehouseInfo({amount:undefined});
        expect(validationResult.error).to.contain("amount");
        done();
    });

    it('Creating warehouse without errors.', (done) => {
      warehouse.createWarehouse()
      .then(warehouseResult => {
        expect(warehouseResult).to.contain.property('_id');
        warehouse.deleteWarehouse(warehouseResult._id)
        .then(deleteResult => {
            done();
        })
        .catch(err => done(err));
      })
      .catch(err => done(err));
    });

    it('Deleting warehouse without errors.', (done) => {
        warehouse.createWarehouse()
        .then(warehouseResult => {
          warehouse.deleteWarehouse(warehouseResult._id)
          .then(deleteResult => {
              expect(deleteResult._id.toString()).to.equal(warehouseResult._id.toString());
              done();
          })
          .catch(err => done(err));
        })
        .catch(err => done(err));
      });

    it('Linking warehouse without errors.', (done) => {
    warehouse.createWarehouse()
    .then(warehouseResult => {
        warehouse.linkWarehouse({_id:warehouseResult._id,storeId:storeId})
        .then(linkingResult => {
            warehouse.getWarehouse(linkingResult._id)
            .then(getResult => {
                expect(getResult.storeId.toString()).to.equal(storeId);
                warehouse.deleteWarehouse(warehouseResult._id)
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

    it('Adding product to warehouse without errors.', (done) => {
        warehouse.addProduct(storeId,testingProduct,categoryId,30)
        .then(addResult => {
            warehouse.getWarehouse(warehouseId)
            .then(getResult => {
                length = getResult.storage.length;
                expect(length).to.equal(7);
                expect(getResult.storage[length-1].productId.toString()).to.equal(testingProduct);
                expect(getResult.storeId.toString()).to.equal(storeId);
                expect(getResult.storage[length-1].categoryId.toString()).to.equal(categoryId);
                expect(getResult.storage[length-1].amount).to.equal(30);
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });
    
    it('Removing product from warehouse without errors.', (done) => {
        warehouse.removeProductFromWarehouse(storeId,testingProduct)
        .then(removeResult => {
            warehouse.getWarehouse(warehouseId)
            .then(getResult => {
                length = getResult.storage.length;
                expect(length).to.equal(6);
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Removing all products of the warehouse without errors.', (done) => {
        
        warehouse.createWarehouse()
        .then(createResult => {
            warehouse.linkWarehouse({_id:createResult._id,storeId:testingStoreId})
            .then(linkingResult => {
                warehouse.addProduct(testingStoreId,testingProduct,testingCategoryId,30)
                .then(addResult1 => {
                    
                    warehouse.addProduct(testingStoreId,testingProduct,testingCategoryId,30)
                    .then(addResult2 => {
                        
                        warehouse.removeProductsFromWarehouse(testingStoreId,testingCategoryId)
                        .then(removeResult => {
                            warehouse.getWarehouse(addResult2._id)
                            .then(getResult => {
                                expect(getResult.storage.length).to.equal(0);
                                warehouse.deleteWarehouseByStoreId(testingStoreId)
                                .then(deletingResult => {
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
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });
    
    it('Deleting warehouse by storeId without errors.', (done) => {
        warehouse.createWarehouse()
        .then(createResult => {
            warehouse.linkWarehouse({_id:createResult._id,storeId:deleteStoreId})
            .then(linkingResult => {
                warehouse.deleteWarehouseByStoreId(deleteStoreId)
                .then(deletingResult => {
                    warehouse.getWarehouse(createResult._id)
                    .then(getResult => {
                        expect(getResult).to.be.null;
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