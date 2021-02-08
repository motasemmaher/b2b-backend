//Requiring the necessary files and models
const UserModel = require('../../models/model/User');
const UserValidation = require('./validate');
//Exporting the class
module.exports =  class User {
    constructor() {}
    //A method to check if a user exists in the database by its ID
    exists(userId)
    {
        const promiseResult = UserModel.exists({userId});
        return promiseResult;
    }
    //A method to check if the username is already taken
    checkUsername(username)
    {
        const promiseResult = UserModel.checkUsername({username});
        return promiseResult;
    }
    //A method to check if the phonenumber is already taken
    checkPhone(phone)
    {
        const promiseResult = UserModel.checkPhone({phone});
        return promiseResult;
    }
    //A method to check if the email is already taken
    checkEmail(email)
    {
        const promiseResult = UserModel.checkEmail({email});
        return promiseResult;
    }
    //A method to get the count of user of a specific role
    countByRole(role)
    {
        const promiseResult = UserModel.countByRole({role});
        return promiseResult;
    }
    //A method to get the count of all users stored in the database
    countAll()
    {
        const promiseResult = UserModel.countAll();
        return promiseResult;
    }
    //A method to validate the user information 
    validateUserInfo(userInfo,isPasswordExists = true)
    {
        const validationResult = UserValidation.validateUserInfo(userInfo, isPasswordExists);
        if(validationResult !== "pass")
            return {error:"Error: "+validationResult};
    }
    //A method to create user
    createUser(userInfo)
    {
        const promiseResult = UserModel.createUser(userInfo);
        return promiseResult;
    }
    //A method to update a user
    updateUser(userInfo)
    {
        const promiseResult = UserModel.updateUser(userInfo);
        return promiseResult;
    }
    //A method to get a user from the databse by using its ID
    getUserById(userId)
    {
        const promiseResult = UserModel.findUserById({userId});
        return promiseResult;
    }
    //A method to get the usrs of a specific role
    getAllUsersIdOfARole(role)
    {
        const promiseResult = UserModel.findAllUsersIdOfARole({role});
        return promiseResult;
    }
    //A method to accept a waitingUser (change him from waitingUser to garageOwner)
    acceptWaitingUser(userId)
    {
        const promiseResult = UserModel.acceptWaitingUser({_id:userId});
        return promiseResult;
    }
    //A method to delete a user from the databse by using its ID
    deleteUser(userId)
    {
        const promiseResult = UserModel.deleteUser({_id:userId});
        return promiseResult;
    }

    // added by thaer
    //A method to get a user from the databse by using its ID
    getUser(userId) {
        const result = UserModel.getUser(userId);
        return result;
    }
    //A method to get a user from the databse by using its username
    findUserByUsername(username) {
        const result = UserModel.findUserByUsername(username);
        return result;
    }
    //A method to delete all the users from the database
    deleteAllUser() {
        const result = UserModel.deleteAllUser();
        return result;
    }
}; 
