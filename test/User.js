process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const connection = require('../connect');
const { exists } = require('../src/models/model/User');
const USER = require('../src/business/Objects').USER;


const existingUserId = "5fd866fb6add9a31e0779905";
const nonExistingUserId = "5fd866fb6add9a31e0770000";

//Valid user information
const fullName = "Testing User"; const username = "testinguser1"; const email = "testinguser1@gmail.com";
const password = "12345678"; const address = "Amman"; const phoneNumber = "0790000000"; const role = "waitingUser";
userInformation = {fullName:fullName,username:username,email:email,password:password,phoneNumber:phoneNumber,address:address,role:role};

//Valid update user information
const updatedFullName = "Testing User"; const updatedUsername = "testinguser2"; const updatedEmail = "testinguser2@gmail.com";
const updatedPassword = "12345678"; const updatedAddress = "Amman"; const updatedPhoneNumber = "0790000002"; const updatedRole = "garageOwner";
updatedUserInformation = {fullName:updatedFullName,username:updatedUsername,email:updatedEmail,password:updatedPassword,phoneNumber:updatedPhoneNumber,address:updatedAddress,role:updatedRole};

//Invalid data for testing
//Invalid user fullname
const shortFullName="M";
const longFullName = new Array(66).join('F');
const invalidFormatFullname = "FFF@FFF";
//Invalid user username
const shortUsername="U";
const longUsername = new Array(66).join('U');
const invalidFormatUsername = "UUU@UUU";
//Invalid user email
const invalidEmail="invalidEmail";
//Invalid user password
const shortPassword = "PPP";
const longPassword = new Array(66).join('P');
//Invalid user phone number
const shortPhoneNumber="07929";
const longPhoneNumber = "0792924975000";
const invalidFormatPhoneNumber = "0007929249";
//Invalid user address
const longAddress = new Array(10).join('A'); //Produces AAAAAAAAA
const shortAddress = "Ad";
const invalidFormatAddress = "Amm@n";
//Invalid user role
const invalidRoleFormat = 12345;
const invalidRoleNonExisting = "anotherUser";

function prepareData (fullName,username,email,password,phoneNumber,address,role)
{
    return {fullName,username,email,password,phoneNumber,address,role};
}

//Testing functions
function test(result,fullName,username,email,phoneNumber,address,role)
{
    expect(result).to.contain.property('_id');
    expect(result).to.contain.property('fullName').to.equal(fullName);
    expect(result).to.contain.property('username').to.equal(username);
    expect(result).to.contain.property('email').to.equal(email);
    expect(result).to.contain.property('password');
    expect(result).to.contain.property('phoneNumber').to.equal(phoneNumber);
    expect(result).to.contain.property('address').to.equal(address);
    expect(result).to.contain.property('role').to.equal(role);
}

function testUpdated(userId,fullName,username,email,phoneNumber,address,role)
{
    const getPromiseResult = USER.getUserById(userId);
    getPromiseResult.then(getResult => {test(getResult,fullName,username,email,phoneNumber,address,role);});
}

function testDeleted(userId)
{
  const getPromiseResult = USER.getUserById(userId);
  getPromiseResult.then(getResult => {expect(getResult).to.be.null;});
}

describe('User Class Tests', () => {    
     
    before((done) => {
      connection.connect()
                .then(() => done())
                .catch((err) => done(err));
    });

    it("Validating user information without errors.", (done) => {
        const data = prepareData(fullName,username,email,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult).to.be.undefined;
        done();
    });

    it("Validating user information with invalid fullName (short).", (done) => {
        const data = prepareData(shortFullName,username,email,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user fullname !");
        done();
    });

    it("Validating user information with invalid fullName (long).", (done) => {
        const data = prepareData(longFullName,username,email,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user fullname !");
        done();
    });

    it("Validating user information with invalid fullName (format).", (done) => {
        const data = prepareData(invalidFormatFullname,username,email,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user fullname !");
        done();
    });

    it("Validating user information with invalid fullName (missing).", (done) => {
        const data = prepareData(undefined,username,email,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user fullname !");
        done();
    });

    it("Validating user information with invalid username (short).", (done) => {
        const data = prepareData(fullName,shortUsername,email,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user username !");
        done();
    });

    it("Validating user information with invalid username (long).", (done) => {
        const data = prepareData(fullName,longUsername,email,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user username !");
        done();
    });

    it("Validating user information with invalid username (format).", (done) => {
        const data = prepareData(fullName,invalidFormatUsername,email,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user username !");
        done();
    });

    it("Validating user information with invalid username (missing).", (done) => {
        const data = prepareData(fullName,undefined,email,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user username !");
        done();
    });

    it("Validating user information with invalid email.", (done) => {
        const data = prepareData(fullName,username,invalidEmail,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user email !");
        done();
    });

    it("Validating user information with invalid email (missing).", (done) => {
        const data = prepareData(fullName,username,undefined,password,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user email !");
        done();
    });

    it("Validating user information with invalid password (short).", (done) => {
        const data = prepareData(fullName,username,email,shortPassword,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user password !");
        done();
    });

    it("Validating user information with invalid password (long).", (done) => {
        const data = prepareData(fullName,username,email,longPassword,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user password !");
        done();
    });

    it("Validating user information with invalid password (missing).", (done) => {
        const data = prepareData(fullName,username,email,undefined,phoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user password !");
        done();
    });

    it("Validating user information with invalid phone number (short).", (done) => {
        const data = prepareData(fullName,username,email,password,shortPhoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user phone number !");
        done();
    });

    it("Validating user information with invalid phone number (long).", (done) => {
        const data = prepareData(fullName,username,email,password,longPhoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user phone number !");
        done();
    });

    it("Validating user information with invalid phone number (format).", (done) => {
        const data = prepareData(fullName,username,email,password,invalidFormatPhoneNumber,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user phone number !");
        done();
    });

    it("Validating user information with invalid phone number (missing).", (done) => {
        const data = prepareData(fullName,username,email,password,undefined,address,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user phone number !");
        done();
    });

    it("Validating user information with invalid address (short).", (done) => {
        const data = prepareData(fullName,username,email,password,phoneNumber,shortAddress,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user address !");
        done();
    });

    it("Validating user information with invalid address (long).", (done) => {
        const data = prepareData(fullName,username,email,password,phoneNumber,longAddress,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user address !");
        done();
    });

    it("Validating user information with invalid address (format).", (done) => {
        const data = prepareData(fullName,username,email,password,phoneNumber,invalidFormatAddress,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user address !");
        done();
    });

    it("Validating user information with invalid address (missing).", (done) => {
        const data = prepareData(fullName,username,email,password,phoneNumber,undefined,role);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user address !");
        done();
    });

    it("Validating user information with invalid role (format).", (done) => {
        const data = prepareData(fullName,username,email,password,phoneNumber,address,invalidRoleFormat);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user role !");
        done();
    });

    it("Validating user information with invalid role (non-existing).", (done) => {
        const data = prepareData(fullName,username,email,password,phoneNumber,address,invalidRoleNonExisting);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user role !");
        done();
    });

    it("Validating user information with invalid address (missing).", (done) => {
        const data = prepareData(fullName,username,email,password,phoneNumber,address,undefined);
        const validationResult = USER.validateUserInfo(data);
        expect(validationResult.error).to.contain("Invalid user role !");
        done();
    });

    it("Checking if the user exists without error (exists)", (done) => {
        USER.exists(existingUserId)
        .then(existsResult => {
            expect(existsResult).to.be.true;
            done();
        })
        .catch(err => done(err));
    });

    it("Checking if the user exists invalid userId", (done) => {
        USER.exists(nonExistingUserId)
        .then(existsResult => {
            expect(existsResult).to.be.false;
            done();
        })
        .catch(err => done(err));
    });
    
    it("Count by role without error (CarOwner)", (done) => {
        USER.countByRole("carOwner")
        .then(countResult => {
            expect(countResult).to.equal(2);
            done();
        })
        .catch(err => done(err));
    });

    it("Count by role without error (GarageOwner)", (done) => {
        USER.countByRole("garageOwner")
        .then(countResult => {
            expect(countResult).to.equal(2);
            done();
        })
        .catch(err => done(err));
    });

    it("Count All users without error", (done) => {
        USER.countAll()
        .then(countResult => {
            expect(countResult).to.equal(4);
            done();
        })
        .catch(err => done(err));
    });


/*
    it("Checking if the email is already taken without errors (not taken)", (done) => {
        USER.checkEmail("nonexisting@gmail.com")
        .then(checkResult => {
            
        })
        .catch(err => done(err));
    });
*/




    it("Creating user without error", (done) => {
        USER.createUser(userInformation)
        .then(createResult => {
            test(createResult,fullName,username,email,phoneNumber,address,"waitingUser");
            USER.deleteUser(createResult._id)
            .then(deleteResult => {
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it("Creating user with duplicate username", (done) => {
        invalidUserInformation = {...userInformation,username:"carowner1"};
        USER.createUser(invalidUserInformation)
        .then(createResult => done())
        .catch(err => {
            expect(err.message).to.contain("username_1 dup key");
            done();
        });
    });

    it("Creating user with duplicate email", (done) => {
        invalidUserInformation = {...userInformation,email:"carowner1@gmail.com"};
        USER.createUser(invalidUserInformation)
        .then(createResult => done())
        .catch(err => {
            expect(err.message).to.contain("email_1 dup key");
            done();
        });
    });

    it("Creating user with duplicate phoneNumber", (done) => {
        invalidUserInformation = {...userInformation,phoneNumber:"0792924971"};
        USER.createUser(invalidUserInformation)
        .then(createResult => done())
        .catch(err => {
            expect(err.message).to.contain("phoneNumber_1 dup key");
            done();
        });
    });

    it("Updating user without error", (done) => {
        USER.createUser(userInformation)
        .then(createResult => {
            USER.updateUser({_id:createResult._id,...updatedUserInformation})
            .then(updateResult => {
                testUpdated(updateResult._id,updatedFullName,updatedUsername,updatedEmail,updatedPhoneNumber,updatedAddress,updatedRole)
                USER.deleteUser(updateResult._id)
                .then(deleteResult => {
                    done();
                })
                .catch(err => done(err));
            })
            .catch(err => done());
        })
        .catch(err => done(err));
    });

    it("Updating user with duplicate username", (done) => {
        USER.createUser(userInformation)
        .then(createResult => {
            updatedUserInformation = {...updatedUserInformation,username:"carowner1"};
            USER.updateUser({_id:createResult._id,...updatedUserInformation})
            .then(updateResult => {
                done();
            })
            .catch(err => {
                expect(err.message).to.contain("username_1 dup key");
                USER.deleteUser(createResult._id)
                .then(deleteResult => {
                    done();
                })
                .catch(err => done(err));
            });
        })
        .catch(err => done(err));
    });

    it("Getting user by id without errors.", (done) => {
        USER.getUserById(existingUserId)
        .then(getResult => {
            test(getResult,"CarOwner","carowner1","carowner1@gmail.com","0792924971","Amman","carOwner");
            done();
        })
        .catch(err => done(err));
    });

    it("Getting user by id with non-existing id.", (done) => {
        USER.getUserById(nonExistingUserId)
        .then(getResult => {
            expect(getResult).to.be.null;
            done();
        })
        .catch(err => done(err));
    });

    it("Getting all users ids of a role without errors. (carOwner)", (done) => {
        USER.getAllUsersIdOfARole("carOwner")
        .then(getResult => {
            expect(getResult.length).to.equal(2);
            done();
        })
        .catch(err => done(err));
    });

    it("Getting all users ids of a role without errors. (waitingUser)", (done) => {
        USER.getAllUsersIdOfARole("waitingUser")
        .then(getResult => {
            expect(getResult.length).to.equal(2);
            done();
        })
        .catch(err => done(err));
    });

    it("Getting all users ids of a role without errors. (garageOwner)", (done) => {
        USER.getAllUsersIdOfARole("garageOwner")
        .then(getResult => {
            expect(getResult.length).to.equal(2);
            done();
        })
        .catch(err => done(err));
    });

    it("Getting all users ids of a role without errors. (invalidRole)", (done) => {
        USER.getAllUsersIdOfARole("invalidRole")
        .then(getResult => {
            expect(getResult.length).to.equal(0);
            done();
        })
        .catch(err => done(err));
    });

    it("Accepting waiting user without error", (done) => {
        USER.createUser(userInformation)
        .then(createResult => {
            USER.acceptWaitingUser(createResult._id)
            .then(acceptResult => {
                testUpdated(acceptResult._id,fullName,username,email,phoneNumber,address,"garageOwner");
                USER.deleteUser(acceptResult._id._id)
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

    it("Deleting user without error", (done) => {
        USER.createUser(userInformation)
        .then(createResult => {
            USER.deleteUser(createResult._id)
            .then(deleteResult => {
                testDeleted(deleteResult._id);
                done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

});