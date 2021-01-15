process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const PRODUCT = require('../src/business/Objects').PRODUCT;

//Needed Objects IDs
const existingProductId = "5fd8a2608b5299203ce67bde";
const existingProductId2 = "5fd8a26d8b5299203ce67be0";
const nonExistingProductId = "5fd8a2608b5299203ce67b00";
const existingStoreId = "5fd89fe08b5299203ce67bc8";
const exisitngCategoryId = "5fd8a1098b5299203ce67bd3";
const testingCategoryId1 = "5fd8a1098b5299203ce67b01";
const testingCategoryId2 = "5fd8a1098b5299203ce67b02";
const testingOfferId = "5fd8a1098b5299203ce67b03";



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

//Invalid product information
//Invalid product name
const invalidNameLong = new Array(66).join('S');
const invalidNameShort = "St1";
const invalidNameFormat = "Testing Product @1";
//Invalid product description
const invalidDescriptionLong = new Array(514).join('D');
const invalidDescriptionShort = "desc";
const invalidDescriptionFormat = "Invalid description @format";
//Invalid product productType
const invalidTypeFormat = 12345;
const invalidTypeNonExisting = "anotherType";
//Invalid product price
const invalidPrice = "invalidPrice";
//Invalid product tags
const invalidTagsLong = new Array(258).join('T');
const invalidTagsShort = "T";
const invalidTagsFormat = "invalidTag@format";

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
  
    it('Validating product information without errors.', (done) => {
        data = prepareData(validName,validType,validPrice,validDescription,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult).to.be.undefined;
        done();
      });
    
      it('Validating product information with invalid product name (long).', (done) => {
        data = prepareData(invalidNameLong,validType,validPrice,validDescription,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("name");
        done();
      });
    
      it('Validating product information with invalid product name (short).', (done) => {
        data = prepareData(invalidNameShort,validType,validPrice,validDescription,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("name");
        done();
      });
    
      it('Validating product information with invalid product name (format).', (done) => {
        data = prepareData(invalidNameFormat,validType,validPrice,validDescription,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("name");
        done();
      });
    
      it('Validating product information with invalid product name (missing).', (done) => {
        data = prepareData(undefined,validType,validPrice,validDescription,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("name");
        done();
      });

      it('Validating product information with invalid product description (long).', (done) => {
        data = prepareData(validName,validType,validPrice,invalidDescriptionLong,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("description");
        done();
      });
    
      it('Validating product information with invalid product description (short).', (done) => {
        data = prepareData(validName,validType,validPrice,invalidDescriptionShort,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("description");
        done();
      });
    
      it('Validating product information with invalid product description (format).', (done) => {
        data = prepareData(validName,validType,validPrice,invalidDescriptionFormat,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("description");
        done();
      });
    
      it('Validating product information with invalid product description (missing).', (done) => {
        data = prepareData(validName,validType,validPrice,undefined,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("description");
        done();
      });

      it('Validating product information with invalid product price (format).', (done) => {
        data = prepareData(validName,validType,invalidPrice,validDescription,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("price");
        done();
      });
    
      it('Validating product information with invalid product price (missing).', (done) => {
        data = prepareData(validName,validType,undefined,validDescription,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("price");
        done();
      });

      it('Validating product information with invalid product price (type).', (done) => {
        data = prepareData(validName,invalidTypeFormat,validPrice,validDescription,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("type");
        done();
      });
    
      it('Validating product information with invalid product type (non-existing).', (done) => {
        data = prepareData(validName,invalidTypeNonExisting,validPrice,validDescription,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("type");
        done();
      });

      it('Validating product information with invalid product type (missing).', (done) => {
        data = prepareData(validName,undefined,validPrice,validDescription,validTags,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("type");
        done();
      });

      it('Validating product information with invalid product tags (long).', (done) => {
        data = prepareData(validName,validType,validPrice,validDescription,invalidTagsLong,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("tags");
        done();
      });
    
      it('Validating product information with invalid product tags (short).', (done) => {
        data = prepareData(validName,validType,validPrice,validDescription,invalidTagsShort,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("tags");
        done();
      });
    
      it('Validating product information with invalid product tags (format).', (done) => {
        data = prepareData(validName,validType,validPrice,validDescription,invalidTagsFormat,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("tags");
        done();
      });
    
      it('Validating product information with invalid product tags (missing).', (done) => {
        data = prepareData(validName,validType,validPrice,validDescription,undefined,null);
        const validationResult = PRODUCT.validateProductInfo(data);
        expect(validationResult.error).to.contain("tags");
        done();
      });

    it('Checking if the product exists without errors.', (done) => {
        PRODUCT.exists(existingProductId)
        .then(existResult => {
            expect(existResult).to.be.true;
            done();
        })
        .catch(err => done(err));
    });

    it('Checking if the product exists (non-existing).', (done) => {
        PRODUCT.exists(nonExistingProductId)
        .then(existResult => {
            expect(existResult).to.be.false;
            done();
        })
        .catch(err => done(err));
    });

    it('Count all products without errors. (all types)', (done) => {
        PRODUCT.countAll("all")
        .then(countResult => {
            expect(countResult).to.equal(18);
            done();
        })
        .catch(err => done(err));
    });

    it('Count all products without errors. (Service type)', (done) => {
        PRODUCT.countAll("Service")
        .then(countResult => {
            expect(countResult).to.equal(18);
            done();
        })
        .catch(err => done(err));
    });

    it('Count all products without errors. (Part type)', (done) => {
        PRODUCT.countAll("Part")
        .then(countResult => {
            expect(countResult).to.equal(0);
            done();
        })
        .catch(err => done(err));
    });

    it('Count products by store without errors. (all types)', (done) => {
        PRODUCT.countByStore(existingStoreId,"all")
        .then(countResult => {
            expect(countResult).to.equal(6);
            done();
        })
        .catch(err => done(err));
    });

    it('Count products by store without errors. (Service type)', (done) => {
        PRODUCT.countByStore(existingStoreId,"Service")
        .then(countResult => {
            expect(countResult).to.equal(6);
            done();
        })
        .catch(err => done(err));
    });

    it('Count products by store without errors. (Part type)', (done) => {
        PRODUCT.countByStore(existingStoreId,"Part")
        .then(countResult => {
            expect(countResult).to.equal(0);
            done();
        })
        .catch(err => done(err));
    });

    it('Count products by category without errors. (all types)', (done) => {
        PRODUCT.countByCategory(exisitngCategoryId,"all")
        .then(countResult => {
            expect(countResult).to.equal(3);
            done();
        })
        .catch(err => done(err));
    });

    it('Count products by category without errors. (Service type)', (done) => {
        PRODUCT.countByCategory(exisitngCategoryId,"Service")
        .then(countResult => {
            expect(countResult).to.equal(3);
            done();
        })
        .catch(err => done(err));
    });

    it('Count products by category without errors. (Part type)', (done) => {
        PRODUCT.countByCategory(exisitngCategoryId,"Part")
        .then(countResult => {
            expect(countResult).to.equal(0);
            done();
        })
        .catch(err => done(err));
    });

    it('Count products by offers without errors.', (done) => {
        PRODUCT.addOffer(existingProductId2,testingOfferId)
        .then(addResult => {
            PRODUCT.countByOffers(existingStoreId)
            .then(countResult => {
                expect(countResult).to.equal(2);
                PRODUCT.removeOffer(testingOfferId)
                    .then(removeResult => {
                        done();
                    })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('Count products by offers of store without errors.', (done) => {
        PRODUCT.countByOffersOfStore(existingStoreId)
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

    it('Deleting products of a categories IDs without errors.', (done) => {
        const data = prepareData(validName,validType,validPrice,validDescription,validTags,existingStoreId,testingCategoryId1);
        PRODUCT.createProduct(data) 
        .then(createResult1 => {
            PRODUCT.createProduct({...data,categoryId:testingCategoryId2}) 
            .then(createResult2 => {
                PRODUCT.deleteProductsOfCategoriesId([testingCategoryId1,testingCategoryId2])
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

    it('Getting products by ID without errors.', (done) => {
        PRODUCT.getProductById(existingProductId)
        .then(getResult => {
            expect(getResult.name).to.equal("product101");
            done();
        })
        .catch(err => done(err));
    });
    
    it('Getting products of a category without errors. (all types - nolimit&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"all",0,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(3);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Part type - nolimit&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Part",0,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(0);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - nolimit&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(3);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - limit=1&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",1,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(1);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - nolimit&skip=1 - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,1,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(2);
            expect(getResult[0].name).to.equal("product112");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - nolimit&noskip - nameSort=1&noPriceSort)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,0,1,0)
        .then(getResult => {
            expect(getResult.length).to.equal(3);
            expect(getResult[0].name).to.equal("product111");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - nolimit&noskip - nameSort=-1&noPriceSort)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,0,-1,0)
        .then(getResult => {
            expect(getResult.length).to.equal(3);
            expect(getResult[0].name).to.equal("product113");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - nolimit&noskip - noNameSort&priceSort=1)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,0,0,1)
        .then(getResult => {
            expect(getResult.length).to.equal(3);
            expect(getResult[0].name).to.equal("product112");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - nolimit&noskip - noNameSort&priceSort=-1)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,0,0,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(3);
            expect(getResult[0].name).to.equal("product111");
            done();
        })
        .catch(err => done(err));
    });
    
    it('Getting products of a category without errors. (Service type - nolimit&noskip - nameSort=1&priceSort=1)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,0,1,1)
        .then(getResult => {
            expect(getResult.length).to.equal(3);
            expect(getResult[0].name).to.equal("product111");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - nolimit&noskip - nameSort=-1&priceSort=-1)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,0,-1,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(3);
            expect(getResult[0].name).to.equal("product113");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - nolimit&noskip - nameSort=1&priceSort=-1)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,0,1,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(3);
            expect(getResult[0].name).to.equal("product111");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - nolimit&noskip - nameSort=-1&priceSort=1)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,0,-1,1)
        .then(getResult => {
            expect(getResult.length).to.equal(3);
            expect(getResult[0].name).to.equal("product113");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting products of a category without errors. (Service type - nolimit&skip=1 - noNameSort&priceSort=-1)', (done) => {
        PRODUCT.getProductsOfCategory(exisitngCategoryId,"Service",0,1,0,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(2);
            expect(getResult[0].name).to.equal("product113");
            done();
        })
        .catch(err => done(err));
    });
    
    it('Adding offer to a product without errors.', (done) => {
        PRODUCT.addOffer(existingProductId2,testingOfferId)
        .then(addResult => {
            PRODUCT.getProductById(existingProductId2)
            .then(getResult => {
                expect(getResult.offer.toString()).to.equal(testingOfferId);
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });
    
    it('Removing offer from a product without errors.', (done) => {
        PRODUCT.removeOffer(testingOfferId)
        .then(removeResult => {
            PRODUCT.getProductById(existingProductId2)
            .then(getResult => {
                expect(getResult.offer).to.be.null;
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });
    
    it('Get expired offers without errors.', (done) => {
        PRODUCT.expiredOffers()
        .then(getResult => {
            expect(getResult.length).to.equal(1);
            done();
        })
        .catch(err => done(err));
    });
    
    it('Getting products with offers of store without errors (nolimit&noskip).', (done) => {
        PRODUCT.addOffer(existingProductId2,testingOfferId)
        .then(addResult => {
            PRODUCT.getProductsWithOffers(0,0)
            .then(getResult => {
                expect(getResult.length).to.equal(2);
                PRODUCT.removeOffer(testingOfferId)
                .then(removeResult => {
                    done();
                })
                .catch(err => done(err));
            })  
            .catch(err => done(err));    
        })
        .catch(err => done(err));
    });

    it('Getting products with offers without errors (limit=1&noskip).', (done) => {
        PRODUCT.addOffer(existingProductId2,testingOfferId)
        .then(addResult => {
            PRODUCT.getProductsWithOffers(1,0)
            .then(getResult => {
                expect(getResult.length).to.equal(1);
                PRODUCT.removeOffer(testingOfferId)
                .then(removeResult => {
                    done();
                })
                .catch(err => done(err));
            })  
            .catch(err => done(err));    
        })
        .catch(err => done(err));
    });

    it('Getting products with offers without errors (nolimit&skip=1).', (done) => {
        PRODUCT.addOffer(existingProductId2,testingOfferId)
        .then(addResult => {
            PRODUCT.getProductsWithOffers(0,1)
            .then(getResult => {
                expect(getResult.length).to.equal(1);
                expect(getResult[0].id).to.equal(existingProductId2);
                PRODUCT.removeOffer(testingOfferId)
                .then(removeResult => {
                    done();
                })
                .catch(err => done(err));
            })  
            .catch(err => done(err));    
        })
        .catch(err => done(err));
    });

    it('Getting products with offers of store of store without errors (nolimit&noskip).', (done) => {
        PRODUCT.addOffer(existingProductId2,testingOfferId)
        .then(addResult => {
            PRODUCT.getProductsWithOffersOfStore(existingStoreId,0,0)
            .then(getResult => {
                expect(getResult.length).to.equal(2);
                PRODUCT.removeOffer(testingOfferId)
                .then(removeResult => {
                    done();
                })
                .catch(err => done(err));
            })  
            .catch(err => done(err));    
        })
        .catch(err => done(err));
    });

    it('Getting products with offers of store without errors (limit=1&noskip).', (done) => {
        PRODUCT.addOffer(existingProductId2,testingOfferId)
        .then(addResult => {
            PRODUCT.getProductsWithOffersOfStore(existingStoreId,1,0)
            .then(getResult => {
                expect(getResult.length).to.equal(1);
                PRODUCT.removeOffer(testingOfferId)
                .then(removeResult => {
                    done();
                })
                .catch(err => done(err));
            })  
            .catch(err => done(err));    
        })
        .catch(err => done(err));
    });

    it('Getting products with offers of store without errors (nolimit&skip=1).', (done) => {
        PRODUCT.addOffer(existingProductId2,testingOfferId)
        .then(addResult => {
            PRODUCT.getProductsWithOffersOfStore(existingStoreId,0,1)
            .then(getResult => {
                expect(getResult.length).to.equal(1);
                expect(getResult[0].id).to.equal(existingProductId2);
                PRODUCT.removeOffer(testingOfferId)
                .then(removeResult => {
                    done();
                })
                .catch(err => done(err));
            })  
            .catch(err => done(err));    
        })
        .catch(err => done(err));
    });
    
    it('Getting all products without errors. (all types - nolimit&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getAllProducts("all",0,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(18);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Part type - nolimit&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getAllProducts("Part",0,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(0);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getAllProducts("Service",0,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(18);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - limit=1&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getAllProducts("Service",1,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(1);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&skip=1 - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getAllProducts("Service",0,1,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(17);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=1&noPriceSort)', (done) => {
        PRODUCT.getAllProducts("Service",0,0,1,0)
        .then(getResult => {
            expect(getResult.length).to.equal(18);
            expect(getResult[0].name).to.equal("product101");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=-1&noPriceSort)', (done) => {
        PRODUCT.getAllProducts("Service",0,0,-1,0)
        .then(getResult => {
            expect(getResult.length).to.equal(18);
            expect(getResult[0].name).to.equal("product213");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - noNameSort&priceSort=1)', (done) => {
        PRODUCT.getAllProducts("Service",0,0,0,1)
        .then(getResult => {
            expect(getResult.length).to.equal(18);
            expect(getResult[0].name).to.equal("product112");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - noNameSort&priceSort=-1)', (done) => {
        PRODUCT.getAllProducts("Service",0,0,0,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(18);
            expect(getResult[0].name).to.equal("product133");
            done();
        })
        .catch(err => done(err));
    });
    
    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=1&priceSort=1)', (done) => {
        PRODUCT.getAllProducts("Service",0,0,1,1)
        .then(getResult => {
            expect(getResult.length).to.equal(18);
            expect(getResult[0].name).to.equal("product101");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=-1&priceSort=-1)', (done) => {
        PRODUCT.getAllProducts("Service",0,0,-1,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(18);
            expect(getResult[0].name).to.equal("product213");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=1&priceSort=-1)', (done) => {
        PRODUCT.getAllProducts("Service",0,0,1,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(18);
            expect(getResult[0].name).to.equal("product101");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=-1&priceSort=1)', (done) => {
        PRODUCT.getAllProducts("Service",0,0,-1,1)
        .then(getResult => {
            expect(getResult.length).to.equal(18);
            expect(getResult[0].name).to.equal("product213");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&skip=1 - noNameSort&priceSort=-1)', (done) => {
        PRODUCT.getAllProducts("Service",0,1,0,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(17);
            expect(getResult[0].name).to.equal("product211");
            done();
        })
        .catch(err => done(err));
    });
    
    it('Getting all products without errors. (all types - nolimit&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"all",0,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(6);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Part type - nolimit&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Part",0,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(0);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(6);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - limit=1&noSkip - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",1,0,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(1);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&skip=1 - noNameSort&noPriceSort)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,1,0,0)
        .then(getResult => {
            expect(getResult.length).to.equal(5);
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=1&noPriceSort)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,0,1,0)
        .then(getResult => {
            expect(getResult.length).to.equal(6);
            expect(getResult[0].name).to.equal("product101");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=-1&noPriceSort)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,0,-1,0)
        .then(getResult => {
            expect(getResult.length).to.equal(6);
            expect(getResult[0].name).to.equal("product113");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - noNameSort&priceSort=1)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,0,0,1)
        .then(getResult => {
            expect(getResult.length).to.equal(6);
            expect(getResult[0].name).to.equal("product112");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - noNameSort&priceSort=-1)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,0,0,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(6);
            expect(getResult[0].name).to.equal("product103");
            done();
        })
        .catch(err => done(err));
    });
    
    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=1&priceSort=1)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,0,1,1)
        .then(getResult => {
            expect(getResult.length).to.equal(6);
            expect(getResult[0].name).to.equal("product101");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=-1&priceSort=-1)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,0,-1,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(6);
            expect(getResult[0].name).to.equal("product113");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=1&priceSort=-1)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,0,1,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(6);
            expect(getResult[0].name).to.equal("product101");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&noskip - nameSort=-1&priceSort=1)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,0,-1,1)
        .then(getResult => {
            expect(getResult.length).to.equal(6);
            expect(getResult[0].name).to.equal("product113");
            done();
        })
        .catch(err => done(err));
    });

    it('Getting all products without errors. (Service type - nolimit&skip=1 - noNameSort&priceSort=-1)', (done) => {
        PRODUCT.getProductsOfStore(existingStoreId,"Service",0,1,0,-1)
        .then(getResult => {
            expect(getResult.length).to.equal(5);
            expect(getResult[0].name).to.equal("product111");
            done();
        })
        .catch(err => done(err));
    });

});