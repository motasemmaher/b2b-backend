process.env.NODE_ENV = 'test';
const Category = require('../src/business/Category/Category');
const expect = require('chai').expect;
const connection = require('../connect');

const category = new Category();

//Valid car data
let validName = "C1";
let tags = "categoryTag1,categoryTag2";
let updateName = "updatedC1";
let updateTags = "updatedCategoryTag1,UpdatedCategoryTag2";

let existingCategoryId = "5fd8a0ff8b5299203ce67bd2";
let nonExistingCategoryId = "5fd89fe08b5299203ce67bc8";

let existingstoreId1 = "5fd89fe08b5299203ce67bc8";
let existingstoreId2 = "5fd8a0078b5299203ce67bcd";

let testingProductId = "5fd9af52fdac372044c3aa00";
let testingStoreId = "5fd9af52fdac372044c3aa01";

//Invalid category data
let invalidNameShort = "c";
let invalidNameLong = new Array(66).join('c');
let invalidNameFormat = "category.1"

//Testing functions
function test(result,name,storeId,tags)
{
    splitTags = tags.split(",");
    expect(result).to.contain.property('_id');
    expect(result).to.contain.property('name').to.equal(name);
    expect(result.storeId.toString()).to.equal(storeId);
    expect(result).to.contain.property('tags');
    expect(result.tags.length).to.equal(2);
    expect(result.tags[0]).to.equal(splitTags[0]);
    expect(result.tags[1]).to.equal(splitTags[1]);
}

function testUpdated(categoryId,name,storeId,tags)
{
    const getPromiseResult = category.findCategoryById(categoryId);
    getPromiseResult.then(getResult => {test(getResult,name,storeId,tags)});
}

function testDeleted(categoryId)
{
  const getPromiseResult = category.findCategoryById(categoryId);
  getPromiseResult.then(getResult => {
      expect(getResult).to.be.null;
  });
}

describe('Category Class Tests', () => {    
  
  before((done) => {
    connection.connect()
              .then(() => done())
              .catch((err) => done(err));
  });

  it('Validating category information without errors.', (done) => {
    const validationResult = category.validateCategoryInfo({name:validName,tags:tags});
    expect(validationResult).to.be.undefined;
    done();
  });
/*
  it('Validating category information invalid name (short).', (done) => {
    const validationResult = category.validateCategoryInfo({name:invalidNameShort,tags:tags});
    expect(validationResult.err).to.contain("name");
    done();
  });

  it('Validating category information invalid name (long).', (done) => {
    const validationResult = category.validateCategoryInfo({name:invalidNameLong,tags:tags});
    expect(validationResult.err).to.contain("name");
    done();
  });

  it('Validating category information invalid name (format).', (done) => {
    const validationResult = category.validateCategoryInfo({name:invalidNameFormat,tags:tags});
    expect(validationResult.err).to.contain("name");
    done();
  });

  it('Checking if the category exists without errors.', (done) => {
    category.exists(existingCategoryId)
    .then(getResult => {
    expect(getResult).to.be.true;
    done();
    })
    .catch(err => done(err));
  });

  it('Checking if the category exists  (nonExistingId).', (done) => {
    category.exists(nonExistingCategoryId)
    .then(getResult => {
    expect(getResult).to.be.false;
    done();
    })
    .catch(err => done(err));
  });

  it('Creating category without errors.', (done) => {
    category.createCategory({name:validName,storeId:testingStoreId,tags:tags})
    .then(createResult => {
    test(createResult,validName,testingStoreId,tags);
        category.deleteCategory(createResult._id)
        .then(deleteResult => {
        done()
        })
        .catch(err => done(err));
    })
    .catch(err => done(err));
  });
  
  it('Updating category without errors.', (done) => {
    category.createCategory({name:validName,storeId:testingStoreId,tags:tags})
    .then(createResult => {
    category.updateCategory({_id:createResult._id,name:updateName,tags:updateTags})
        .then(updateResult => {
        testUpdated(updateResult._id,updateName,testingStoreId,updateTags);
        category.deleteCategory(updateResult._id)
            .then(deletedResult => {
            done();
            })
            .catch(err => done(err))
        })
        .catch(err => done(err))
    })
    .catch(err => done(err));
  });

  it('Deleting category without errors.', (done) => {
    category.createCategory({name:validName,storeId:testingStoreId,tags:tags})
    .then(createResult => {
    category.deleteCategory(createResult._id)
        .then(deletedResult => {
        testDeleted(deletedResult._id);
        done();
        })
        .catch(err => done(err))
        })
    .catch(err => done(err));
  });
  */

  //--------------------------------------------------------------------------------------
  /*
  it('Getting products of a category without errors.', (done) => {
    category.getProductsOfCategory(existingCategoryId)
    .then(productsResult => {
    expect(productsResult.length).to.equal(3);
    done();
    })
    .catch(err => done(err));
  });

  it('Getting products of a category (none existing category).', (done) => {
    category.getProductsOfCategory(nonExistingCategoryId)
    .then(productsResult => {
    expect(productsResult.length).to.equal(0);
    done();
    })
    .catch(err => done(err));
  });
  */
 //--------------------------------------------------------------------------------------
 /*
  it('Adding product to category without errors.', (done) => {
    category.addProduct(existingCategoryId,testingProductId)
    .then(addResult => {
        category.findCategoryById(existingCategoryId)
        .then(getResult => {
            length = getResult.products.length;
            expect(length).to.equal(4);
            expect(getResult.products[length-1].toString()).to.equal(testingProductId);
            done();
        })
        .catch(err => done(err));
    })
    .catch(err => done(err));
  });

  it('Removing product from category without errors.', (done) => {
    category.removeProductFromCategory(existingCategoryId,testingProductId)
    .then(removeResult => {
        category.findCategoryById(existingCategoryId)
        .then(getResult => {
            length = getResult.products.length;
            expect(length).to.equal(3);
            done();
        })
        .catch(err => done(err));
    })
    .catch(err => done(err));
  });

  it('Getting category by Id without errors.', (done) => {
    category.findCategoryById(existingCategoryId)
    .then(getResult => {
    test(getResult,"category101",getResult.storeId.toString(),"categoryTag101,categoryTag102");
    done();
    })
    .catch(err => done(err));
  });

  it('Getting category by name without errors.', (done) => {
    category.findCategoryByName("category101")
    .then(getResult => {
    test(getResult,"category101",getResult.storeId.toString(),"categoryTag101,categoryTag102");
    done();
    })
    .catch(err => done(err));
  });

  it('Deleting categories by store Id without errors.', (done) => {
    category.createCategory({name:validName,storeId:testingStoreId,tags:tags})
    .then(firstCreateResult => {
    category.createCategory({name:validName,storeId:testingStoreId,tags:tags})
        .then(secondCreateResult => {
        category.deleteCategoriesByStoreIds(testingStoreId)
        .then(deleteResult => {
        expect(deleteResult.deletedCount).to.equal(2);
        done();
        })
        .catch(err => done(err));
        })
        .catch(err => done(err));
    })
    .catch(err => done(err));
  });

  it('Getting all categories of a user stores without errors.', (done) => {
    category.getAllCategoriesInUserStores([existingstoreId1,existingstoreId2])
    .then(getResult => {
    expect(getResult.length).to.equal(4);
    done();
    })
    .catch(err => done(err));
  });
*/
});