process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const PRODUCT = require('../src/business/Objects').PRODUCT;

//Needed Objects IDs
const existingProductId = "5fd8a2608b5299203ce67bde";
const nonExistingProductId = "5fd8a2608b5299203ce67b00";
const existingStoreId = "5fd89fe08b5299203ce67bc8";
const exisitngCategoryId = "5fd8a1098b5299203ce67bd3";
const testingCategoryId1 = "5fd8a1098b5299203ce67b01";



//Valid product Information
const validName = "Testing Product 1";
const validType = "Service";
const validPrice = 10;
const validDescription = "This is testing description for product 1.";
const validTags = "testingProductTag1,testingProductTag2";

//Valid Update Information
const updatedName = "Testing Product 1 Updated";
const updatedType = "Part";
const updatedPrice = 15;
const updatedDescription = "This is the updated testing description for product 1.";
const updatedTags = "testingProductTag3,testingProductTag4";


function prepareData(name,productType,price,description,tags,storeId,categoryId)
{
    return {name,productType,price,description,tags,storeId,categoryId};
}

function test(result,name,type,price,description,tags,storeId,categoryId)
{
    const splitTags = tags.split(",");
    expect(result).to.contain.property('_id');
    expect(result).to.contain.property('name').to.equal(name);
    expect(result).to.contain.property('productType').to.equal(type);
    expect(result).to.contain.property('price').to.equal(price);
    expect(result).to.contain.property('description').to.equal(description);
    expect(result.tags.length).to.equal(2);
    for(i=0;i<result.tags.length;i++)
        expect(result.tags[i]).to.equal(splitTags[i]);
    expect(result.categoryId.toString()).to.equal(categoryId);
    expect(result.storeId.toString()).to.equal(storeId);
}

function testUpdated(productId,name,type,price,description,tags,storeId,categoryId)
{
  const getPromiseResult = PRODUCT.getProductById(productId);
  getPromiseResult.then(getResult => {
    test(getResult,name,type,price,description,tags,storeId,categoryId);
  });
}

function testDeleted(productId)
{
  const getPromiseResult = PRODUCT.getProductById(productId);
  getPromiseResult.then(getResult => {
      expect(getResult).to.be.null;
  });
}

describe('Product Class Tests', () => {    

    before((done) => {
      connection.connect()
                .then(() => done())
                .catch((err) => done(err));
    });
  
    it('Checking if the product exists without errors.', (done) => {
      PRODUCT.exists(existingProductId)
      .then(existResult => {
          expect(existResult).to.be.true;
          done();
      })
      .catch(err => done(err));
    });
/*
    it('Checking if the product exists (non-existing).', (done) => {
        PRODUCT.exists(nonExistingProductId)
        .then(existResult => {
            expect(existResult).to.be.false;
            done();
        })
        .catch(err => done(err));
    });

    it('Count all products without errors.', (done) => {
        PRODUCT.countAll()
        .then(countResult => {
            expect(countResult).to.equal(18);
            done();
        })
        .catch(err => done(err));
    });

    it('Count products by store without errors.', (done) => {
        PRODUCT.countByStore(existingStoreId)
        .then(countResult => {
            expect(countResult).to.equal(6);
            done();
        })
        .catch(err => done(err));
    });

    it('Count products by category without errors.', (done) => {
        PRODUCT.countByCategory(exisitngCategoryId)
        .then(countResult => {
            expect(countResult).to.equal(3);
            done();
        })
        .catch(err => done(err));
    });

    it('Count products by offer without errors.', (done) => {
        PRODUCT.countByOffers(existingStoreId)
        .then(countResult => {
            expect(countResult).to.equal(1);
            done();
        })
        .catch(err => done(err));
    });

    it('Creating product without errors.', (done) => {
        const data = prepareData(validName,validType,validPrice,validDescription,validTags,existingStoreId,exisitngCategoryId);
        PRODUCT.createProduct(data) 
        .then(createResult => {
            test(createResult,validName,validType,validPrice,validDescription,validTags,existingStoreId,exisitngCategoryId);
            PRODUCT.deleteProduct(createResult._id)
            .then(deleteResult => {
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Updating product without errors.', (done) => {
        const data = prepareData(validName,validType,validPrice,validDescription,validTags,existingStoreId,exisitngCategoryId);
        const updatedData = prepareData(updatedName,updatedType,updatedPrice,updatedDescription,updatedTags,existingStoreId,exisitngCategoryId);
        PRODUCT.createProduct(data) 
        .then(createResult => {
            PRODUCT.updateProduct({_id:createResult._id,...updatedData})
            .then(updateResult => {
                testUpdated(updateResult._id,updatedName,updatedType,updatedPrice,updatedDescription,updatedTags,existingStoreId,exisitngCategoryId)
                PRODUCT.deleteProduct(updateResult._id)
                .then(deleteResult => {
                    done();
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Deleting product without errors.', (done) => {
        const data = prepareData(validName,validType,validPrice,validDescription,validTags,existingStoreId,exisitngCategoryId);
        PRODUCT.createProduct(data) 
        .then(createResult => {
            PRODUCT.deleteProduct(createResult._id)
            .then(deleteResult => {
                testDeleted(deleteResult._id);
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Deleting products of a category without errors.', (done) => {
        const data = prepareData(validName,validType,validPrice,validDescription,validTags,existingStoreId,testingCategoryId1);
        PRODUCT.createProduct(data) 
        .then(createResult1 => {
            PRODUCT.createProduct(data) 
            .then(createResult2 => {
                PRODUCT.deleteProductsOfCategory(testingCategoryId1)
                .then(deleteResult => {
                    expect(deleteResult.deletedCount).to.equal(2);
                    testDeleted(createResult1._id);
                    testDeleted(createResult2._id);
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