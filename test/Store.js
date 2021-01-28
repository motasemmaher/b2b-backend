process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const STORE = require('../src/business/Objects').STORE;

//Needed document IDs
const existingStoreId = "5fd8a0a58b5299203ce67bd1";
const nonExistingStoreId = "5fd89fe08b5299203ce67b01";

const existingGarageOwnerId = "5fd89fdf8b5299203ce67bc5";
const nonExistingGarageOwnerId = "5fd89fdf8b5299203ce67b01";
const testingUserId = "5fd89fdf8b5299203ce67b02";

//Existing store information
const name = "store102";
const address = "Amman";
const description = "This is a description for the store."
const openTime = "08:30 AM";
const closeTime = "11:00 PM";
const tags = "mercedez,bmw,jaguar";
const userId = "5fd89fdf8b5299203ce67bc5";
const warehouseId = "5fd8a0a58b5299203ce67bd0";
const menuId = "5fd8a0a58b5299203ce67bcf";
const lat = 29.36364235460667;
const long = 47.99697095166016;



//Valid Information
const validName = "Testing Store 1";
const validAddress = "Amman";
const validDescription = "This is a description for testing store 1."
const validOpenTime = "8:30 AM";
const validCloseTime = "11:30 PM";
const validTags = "testingStoreTag1,testingStoreTag2,testingStoreTag3";
const validLat = 29.148081480846972;
const validLong = 48.03802823718942;

//Valid Update Information
const updatedName = "Testing Store 1 Updated";
const updatedAddress = "Irbid";
const updatedDescription = "This is an updated description for testing store 1."
const updatedOpenTime = "9:30 AM";
const updatedCloseTime = "10:30 PM";
const updatedTags = "updatedTestingStoreTag1,updatedTestingStoreTag2,updatedTestingStoreTag3";
const updatedLat = 28.148081480846972;
const updatedLong = 47.03802823718942;

//Invalid store name
const invalidNameLong = new Array(66).join('S');
const invalidNameShort = "St1";
const invalidNameFormat = "Testing Store @1";

//Invalid store address
const invalidAddressLong = new Array(11).join('A'); //Produces AAAAAAAAAA
const invalidAddressShort = "Add";
const invalidAddressFormat = "Amm@n";

//Invalid store description
const invalidDescriptionLong = new Array(514).join('D');
const invalidDescriptionShort = "desc";
const invalidDescriptionFormat = "Invalid description @format";

//Invalid store times
const invalidOpenTimeFormat = "8:40 ZM";
const invalidOpenTimeNum = "13:61 AM";
const invalidCloseTimeFormat = "11:40 AZ";
const invalidCloseTimeNum = "13:61 PM";

//Invalid store tags
const invalidTagsLong = new Array(258).join('T');
const invalidTagsShort = "T";
const invalidTagsFormat = "invalidTag@format";

//Invalid store coordinates
const invalidLat = "aa,0000047584758";
const invalidLong = "aa,0000047584758";


function prepareData(name,address,description,openTime,closeTime,lat,long,tags,userId,warehouseId,menuId)
{
    return {name,address,description,openTime,closeTime,lat,long,tags,userId,warehouse:warehouseId,menu:menuId};
}

//Testing functions
function test(result,name,address,description,openTime,closeTime,lat,long,tags,userId,warehouseId,menuId,create=false)
{
    expect(result).to.contain.property('_id');
    expect(result).to.contain.property('name').to.equal(name);
    expect(result).to.contain.property('address').to.equal(address);
    expect(result).to.contain.property('openTime').to.equal(openTime);
    expect(result).to.contain.property('closeTime').to.equal(closeTime);
    if(create)
    {
        splitTags = tags.split(",");
        expect(result).to.contain.property('description').to.equal(description);
        expect(result.tags[0]).to.equal(splitTags[0]);
        expect(result.tags[1]).to.equal(splitTags[1]);
        expect(result.tags[2]).to.equal(splitTags[2]);
        expect(result.userId).to.equal(userId);
        expect(result.warehouse.toString()).to.equal(warehouseId);
        expect(result.menu.toString()).to.equal(menuId);
    }

}

function testUpdated(storeId,name,address,description,openTime,closeTime,lat,long,tags,userId,warehouseId,menuId,create)
{
    const getPromiseResult = STORE.getStoreById(storeId);
    getPromiseResult.then(getResult => {test(getResult,name,address,description,openTime,closeTime,lat,long,tags,userId,warehouseId,menuId,create)});
}

function testDeleted(storeId)
{
  const getPromiseResult = STORE.getStoreById(storeId);
  getPromiseResult.then(getResult => {
      expect(getResult).to.be.null;
  });
}

describe('Store Class Tests', () => {    
  
  before((done) => {
    connection.connect()
              .then(() => done())
              .catch((err) => done(err));
  });

  it('Validating store information without errors.', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult).to.be.undefined;
    done();
  });

  it('Validating store information with invalid store name (long).', (done) => {
    data = prepareData(invalidNameLong,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("name");
    done();
  });

  it('Validating store information with invalid store name (short).', (done) => {
    data = prepareData(invalidNameShort,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("name");
    done();
  });

  it('Validating store information with invalid store name (format).', (done) => {
    data = prepareData(invalidNameFormat,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("name");
    done();
  });

  it('Validating store information with invalid store name (missing).', (done) => {
    data = prepareData(undefined,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("name");
    done();
  });

  it('Validating store information with invalid store address (long).', (done) => {
    data = prepareData(validName,invalidAddressLong,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("address");
    done();
  });

  it('Validating store information with invalid store address (short).', (done) => {
    data = prepareData(validName,invalidAddressShort,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("address");
    done();
  });

  it('Validating store information with invalid store address (format).', (done) => {
    data = prepareData(validName,invalidAddressFormat,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("address");
    done();
  });

  it('Validating store information with invalid store address (missing).', (done) => {
    data = prepareData(validName,undefined,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("address");
    done();
  });

  it('Validating store information with invalid store description (long).', (done) => {
    data = prepareData(validName,validAddress,invalidDescriptionLong,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("description");
    done();
  });

  it('Validating store information with invalid store Description (short).', (done) => {
    data = prepareData(validName,validAddress,invalidDescriptionShort,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("description");
    done();
  });

  it('Validating store information with invalid store Description (format).', (done) => {
    data = prepareData(validName,validAddress,invalidDescriptionFormat,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("description");
    done();
  });

  it('Validating store information with invalid store Description (missing).', (done) => {
    data = prepareData(validName,validAddress,undefined,validOpenTime,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("description");
    done();
  });

  it('Validating store information with invalid store openTime (format).', (done) => {
    data = prepareData(validName,validAddress,validDescription,invalidOpenTimeFormat,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("open time");
    done();
  });

  it('Validating store information with invalid store openTime (time).', (done) => {
    data = prepareData(validName,validAddress,validDescription,invalidOpenTimeNum,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("open time");
    done();
  });

  it('Validating store information with invalid store openTime (missing).', (done) => {
    data = prepareData(validName,validAddress,validDescription,undefined,validCloseTime,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("open time");
    done();
  });

  it('Validating store information with invalid store closeTime (format).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,invalidCloseTimeFormat,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("close time");
    done();
  });

  it('Validating store information with invalid store closeTime (time).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,invalidCloseTimeNum,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("close time");
    done();
  });

  it('Validating store information with invalid store closeTime (missing).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,undefined,validLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("close time");
    done();
  });

  it('Validating store information with invalid store tags (long).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,invalidTagsLong);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("tags");
    done();
  });

  it('Validating store information with invalid store tags (short).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,invalidTagsShort);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("tags");
    done();
  });

  it('Validating store information with invalid store tags (format).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,invalidTagsFormat);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("tags");
    done();
  });

  it('Validating store information with invalid store tags (missing).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,undefined);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("tags");
    done();
  });

  it('Validating store information with invalid store lat (format).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,invalidLat,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("latitude");
    done();
  });

  it('Validating store information with invalid store lat (missing).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,undefined,validLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("latitude");
    done();
  });

  it('Validating store information with invalid store long (format).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,invalidLong,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("longitude");
    done();
  });

  it('Validating store information with invalid store long (missing).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,undefined,validTags);
    const validationResult = STORE.validateStoreInfo(data);
    expect(validationResult.error).to.contain("longitude");
    done();
  });

  it('Checking if store exists without errors.', (done) => {
    STORE.exists(existingStoreId)
    .then(getResult => {
        expect(getResult).to.not.be.null;
        done();
    })
    .catch(err => done(err));
  });

  it('Checking for a non-existing store.', (done) => {
    STORE.exists(nonExistingStoreId)
    .then(getResult => {
        expect(getResult).to.be.null;
        done();
    })
    .catch(err => done(err));
  });

  it('Count of all stores without errors.', (done) => {
    STORE.countAll()
    .then(counteResult => {
        expect(counteResult).to.equal(5);
        done();
    })
    .catch(err => done(err));
  });

  it('Count of garageOwner stores without errors.', (done) => {
    STORE.countByGarageOwner(existingGarageOwnerId)
    .then(counteResult => {
        expect(counteResult).to.equal(2);
        done();
    })
    .catch(err => done(err));
  });

  it('Count of non-exisitng garageOwner stores.', (done) => {
    STORE.countByGarageOwner(nonExistingGarageOwnerId)
    .then(counteResult => {
        expect(counteResult).to.equal(0);
        done();
    })
    .catch(err => done(err));
  });

  it('Count of stores with the same provided address without errors.', (done) => {
    STORE.countBySameAddress("Amman")
    .then(counteResult => {
        expect(counteResult).to.equal(5);
        done();
    })
    .catch(err => done(err));
  });

  it('Count of stores with the same provided address (non).', (done) => {
    STORE.countBySameAddress("Irbid")
    .then(counteResult => {
        expect(counteResult).to.equal(0);
        done();
    })
    .catch(err => done(err));
  });

  it('Creating store without errors.', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags,userId,warehouseId,menuId);
    STORE.createStore(data)
    .then(createResult => {
    test(createResult,validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags,userId,warehouseId,menuId,true);
    STORE.deleteStore(createResult._id)
        .then(deleteResult => {
            done();
        })
        .catch(err => done(err));
    })
    .catch(err => done(err));
  });

  it('Creating store error (without providing a name).', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags,userId,warehouseId,menuId);
    STORE.createStore({...data,name:null})
    .then(createResult => {
        done();
    })
    .catch(err =>{
        expect(err.message).to.contain("Path `name` is required.");
        done();
    });
  });

  it('Updating store without errors.', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags,userId,warehouseId,menuId);
    updatedData = prepareData(updatedName,updatedAddress,updatedDescription,updatedOpenTime,updatedCloseTime,updatedLat,updatedLong,updatedTags,userId,warehouseId,menuId);
    STORE.createStore(data)
    .then(createResult => {
    STORE.updateStore({_id:createResult._id,...updatedData})
        .then(updateResult => {
        testUpdated(updateResult._id,updatedName,updatedAddress,updatedDescription,updatedOpenTime,updatedCloseTime,updatedLat,updatedLong,updatedTags,userId,warehouseId,menuId,true)
        STORE.deleteStore(updateResult._id)
            .then(deleteResult => {
            done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    })
    .catch(err => done(err));
  });

  it('Deleting store without errors.', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags,userId,warehouseId,menuId);
    STORE.createStore(data)
    .then(createResult => {
    test(createResult,validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags,userId,warehouseId,menuId,true);
    STORE.deleteStore(createResult._id)
        .then(deleteResult => {
            testDeleted(deleteResult._id);
            done();
        })
        .catch(err => done(err));
    })
    .catch(err => done(err));
  });

  it('Deleting stores by user Id without errors.', (done) => {
    data = prepareData(validName,validAddress,validDescription,validOpenTime,validCloseTime,validLat,validLong,validTags,testingUserId,warehouseId,menuId);
    STORE.createStore(data)
    .then(createResult1 => {
    STORE.createStore(data)
        .then(createResult2 => {
        STORE.deleteStoreByUserId(testingUserId)
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

  it('Getting all store without errors (nolimit&noskip).', (done) => {
    STORE.getAllStores(0,0)
    .then(getResult => {
        expect(getResult.length).to.equal(5);
        done();
    })
    .catch(err => done(err))
  });

  it('Getting all store without errors (limit=1&noskip).', (done) => {
    STORE.getAllStores(1,0)
    .then(getResult => {
        expect(getResult.length).to.equal(1);
        done();
    })
    .catch(err => done(err))
  });

  it('Getting all store without errors (nolimit&skip=1).', (done) => {
    STORE.getAllStores(0,1)
    .then(getResult => {
        test(getResult[1],name,address,description,openTime,closeTime,lat,long,tags,userId,warehouseId,menuId);
        expect(getResult.length).to.equal(4);
        done();
    })
    .catch(err => done(err))
  });

  it('Getting store with same address without errors (nolimit&noskip).', (done) => {
    STORE.getSameAddressStores("Amman",0,0)
    .then(getResult => {
        expect(getResult.length).to.equal(5);
        done();
    })
    .catch(err => done(err))
  });

  it('Getting store with same address without errors (limit=1&noskip).', (done) => {
    STORE.getSameAddressStores("Amman",1,0)
    .then(getResult => {
        expect(getResult.length).to.equal(1);
        done();
    })
    .catch(err => done(err))
  });

  it('Getting store with same address without errors (nolimit&skip=1).', (done) => {
    STORE.getSameAddressStores("Amman",0,1)
    .then(getResult => {
        test(getResult[1],name,address,description,openTime,closeTime,lat,long,tags,userId,warehouseId,menuId);
        expect(getResult.length).to.equal(4);
        done();
    })
    .catch(err => done(err))
  });

  it('Getting near stores by location without errors (nolimit&noskip).', (done) => {
    STORE.getStoresByLocation(validLat,validLong,0,0)
    .then(getResult => {
        expect(getResult.length).to.equal(5);
        expect(getResult[0].name).to.equal("store401");
        expect(getResult[1].name).to.equal("store301");
        expect(getResult[2].name).to.equal("store101");
        expect(getResult[3].name).to.equal("store102");
        expect(getResult[4].name).to.equal("store201");
        done();
    })
    .catch(err => done(err))
  });

  it('Getting near stores by location without errors (limit=1&noskip).', (done) => {
    STORE.getStoresByLocation(validLat,validLong,1,0)
    .then(getResult => {
        expect(getResult.length).to.equal(1);
        expect(getResult[0].name).to.equal("store401");
        done();
    })
    .catch(err => done(err))
  });

  it('Getting near stores by location without errors (nolimit&skip=1).', (done) => {
    STORE.getStoresByLocation(validLat,validLong,0,1)
    .then(getResult => {
        expect(getResult.length).to.equal(4);
        expect(getResult[0].name).to.equal("store301");
        expect(getResult[1].name).to.equal("store101");
        expect(getResult[2].name).to.equal("store102");
        expect(getResult[3].name).to.equal("store201");
        done();
    })
    .catch(err => done(err))
  });

  it('Getting store Ids by user Id (without errors).', (done) => {
    STORE.getStoresIdByUserId(existingGarageOwnerId)
    .then(getResult => {
        expect(getResult.length).to.equal(2);
        done();
    })
    .catch(err => done(err))
  });

  it('Getting store Ids by user Id (non-existing userId).', (done) => {
    STORE.getStoresIdByUserId(nonExistingGarageOwnerId)
    .then(getResult => {
        expect(getResult).to.be.null;
        done();
    })
    .catch(err => done(err))
  });

  it('Getting store of garage owner without errors (nolimit&noskip).', (done) => {
    STORE.getFullStoresByUserId(existingGarageOwnerId,0,0)
    .then(getResult => {
        expect(getResult.length).to.equal(2);
        done();
    })
    .catch(err => done(err))
  });

  it('Getting store of garage owner without errors (limit=1&noskip).', (done) => {
    STORE.getFullStoresByUserId(existingGarageOwnerId,1,0)
    .then(getResult => {
        expect(getResult.length).to.equal(1);
        done();
    })
    .catch(err => done(err))
  });

  it('Getting store of garage owner without errors (nolimit&skip=1).', (done) => {
    STORE.getFullStoresByUserId(existingGarageOwnerId,0,1)
    .then(getResult => {
        test(getResult[0],name,address,description,openTime,closeTime,lat,long,tags,userId,warehouseId,menuId);
        expect(getResult.length).to.equal(1);
        done();
    })
    .catch(err => done(err))
  });
  

  it('Getting store by id without errors.', (done) => {
    STORE.getStoreById(existingStoreId)
    .then(getResult => {
        test(getResult,name,address,description,openTime,closeTime,lat,long,tags,userId,warehouseId,menuId);
        done();
    })
    .catch(err => done(err))
  });

});