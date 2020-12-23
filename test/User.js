process.env.NODE_ENV = 'test';
const User = require('../src/business/User/User');
const expect = require('chai').expect;
const connection = require('../connect');
const { exists } = require('../src/models/model/User');


const user = new User();


let userId = "5fd866fb6add9a31e0779905";
let nonExistingUserId = "5fd866fb6add9a31e0770000";

//Valid user information
let fullName = "Testing User"; let username = "testinguser1"; let email = "testinguser1@gmail.com";
let password = "12345678"; let address = "Amman"; let phoneNumber = "0790000000"; let role = "waitingUser";
userInformation = {fullName:fullName,username:username,email:email,password:password,phoneNumber:phoneNumber,address:address,role:role};

//Valid update user information
let updatedFullName = "Testing User"; let updatedUsername = "testinguser2"; let updatedEmail = "testinguser2@gmail.com";
let updatedPassword = "12345678"; let updatedAddress = "Amman"; let updatedPhoneNumber = "0790000002"; let updatedRole = "garageOwner";
updatedUserInformation = {fullName:updatedFullName,username:updatedUsername,email:updatedEmail,password:updatedPassword,phoneNumber:updatedPhoneNumber,address:updatedAddress,role:updatedRole};

//Testing functions
function test(result,fullName,username,email,password,phoneNumber,address,role)
{
    expect(result).to.contain.property('_id');
    expect(result).to.contain.property('fullName').to.equal(fullName);
    expect(result).to.contain.property('username').to.equal(username);
    expect(result).to.contain.property('email').to.equal(email);
    expect(result).to.contain.property('password').to.equal(password);
    expect(result).to.contain.property('phoneNumber').to.equal(phoneNumber);
    expect(result).to.contain.property('address').to.equal(address);
    expect(result).to.contain.property('role').to.equal(role);
}

describe('User Class Tests', () => {    

    before((done) => {
      connection.connect()
                .then(() => done())
                .catch((err) => done(err));
    });

    it("Checking if the user exists without error (exists)", (done) => {
        user.exists(userId)
        .then(existsResult => {
            expect(existsResult._id.toString()).to.equal(userId);
            done();
        })
        .catch(err => done(err));
    });

    it("Checking if the user exists invalid userId", (done) => {
        user.exists(nonExistingUserId)
        .then(existsResult => {
            expect(existsResult).to.be.null;
            done();
        })
        .catch(err => done(err));
    });
    
    it("Count by role without error (CarOwner)", (done) => {
        user.countByRole("carOwner")
        .then(countResult => {
            expect(countResult).to.equal(2);
            done();
        })
        .catch(err => done(err));
    });

    it("Count by role without error (GarageOwner)", (done) => {
        user.countByRole("garageOwner")
        .then(countResult => {
            expect(countResult).to.equal(2);
            done();
        })
        .catch(err => done(err));
    });

    it("Count All users without error", (done) => {
        user.countAll()
        .then(countResult => {
            expect(countResult).to.equal(4);
            done();
        })
        .catch(err => done(err));
    });

    it("Creating user without error", (done) => {
        user.createUser(userInformation)
        .then(createResult => {
            test(createResult,fullName,username,email,password,phoneNumber,address,"waitingUser");
            user.deleteUser(createResult._id)
            .then(deleteResult => {
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it("Creating user with duplicate username", (done) => {
        invalidUserInformation = {...userInformation,username:"carowner1"};
        user.createUser(invalidUserInformation)
        .then(createResult => done())
        .catch(err => {
            expect(err.message).to.contain("username_1 dup key");
            done();
        });
    });

    it("Creating user with duplicate email", (done) => {
        invalidUserInformation = {...userInformation,email:"carowner1@gmail.com"};
        user.createUser(invalidUserInformation)
        .then(createResult => done())
        .catch(err => {
            expect(err.message).to.contain("email_1 dup key");
            done();
        });
    });

    it("Creating user with duplicate phoneNumber", (done) => {
        invalidUserInformation = {...userInformation,phoneNumber:"0792924971"};
        user.createUser(invalidUserInformation)
        .then(createResult => done())
        .catch(err => {
            expect(err.message).to.contain("phoneNumber_1 dup key");
            done();
        });
    });

    it("Updating user without error", (done) => {
        user.createUser(userInformation)
        .then(createResult => {
            user.updateUser({_id:createResult._id,...updatedUserInformation})
            .then(updateResult => {
                user.getUserById(updateResult._id)
                .then(getResult => {
                    test(getResult,updatedFullName,updatedUsername,updatedEmail,updatedPassword,updatedPhoneNumber,updatedAddress,updatedRole);
                    user.deleteUser(getResult._id)
                    .then(deleteResult => {
                        done();
                    })
                    .catch(err => done(err));
                })
                .catch(err => done(err));
            })
            .catch(err => done());
        })
        .catch(err => done(err));
    });

   




    /*
    it('Validating warehouse information without errors.', (done) => {
        const validationResult = warehouse.validateWarehouseInfo({amount:1111});
        expect(validationResult).to.be.undefined;
        done();
    });

    it('Validating warehouse information invalid amount (format).', (done) => {
        const validationResult = warehouse.validateWarehouseInfo({amount:"11a1"});
        expect(validationResult.err).to.contain("amount");
        done();
    });

    it('Validating warehouse information invalid amount (length).', (done) => {
        const validationResult = warehouse.validateWarehouseInfo({amount:11111});
        expect(validationResult.err).to.contain("amount");
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
        warehouse.addProduct(storeId,addAndRemoveProductId,categoryId,30)
        .then(addResult => {
            warehouse.getWarehouse(warehouseId)
            .then(getResult => {
                length = getResult.storage.length;
                expect(length).to.equal(7);
                expect(getResult.storage[length-1].productId.toString()).to.equal(addAndRemoveProductId);
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
        warehouse.removeProductFromWarehouse(storeId,addAndRemoveProductId)
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
        
        warehouse.addProduct(otherStoreId,addAndRemoveProductId,otherCategoryId,30)
        .then(addResult1 => {
        warehouse.addProduct(otherStoreId,addAndRemoveProductId,otherCategoryId,30)
            .then(addResult2 => {
            warehouse.removeProductsFromWarehouse(otherStoreId,otherCategoryId)
                .then(removeResult => {
                warehouse.getWarehouse(addResult2._id)
                    .then(getResult => {
                        expect(getResult.storage.length).to.equal(6);
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
    */
});