const UserModel = require('../../models/model/User');
const UserValidation = require('./validate');
module.exports =  class User {
    constructor() {}

    exists(userId)
    {
        const promiseResult = UserModel.exists({userId:userId});
        return promiseResult;
    }

    countByRole(role)
    {
        const promiseResult = UserModel.countByRole({role:role});
        return promiseResult;
    }

    countAll()
    {
        const promiseResult = UserModel.countAll();
        return promiseResult;
    }

    validateUserInfo(userInfo)
    {
        const validationResult = UserValidation.validateUserInfo(userInfo);
        if(validationResult !== "pass")
            return {err:"Error: "+validationResult};
    }

    createUser(userInfo)
    {
        const promiseResult = UserModel.createUser(userInfo);
        return promiseResult;
    }
    
    updateUser(userInfo)
    {
        const promiseResult = UserModel.updateUser(userInfo);
        return promiseResult;
    }

    getUserById(userId)
    {
        const promiseResult = UserModel.findUserById({userId:userId});
        return promiseResult;
    }

    getAllUsersIdOfARole(role)
    {
        const promiseResult = UserModel.findAllUsersIdOfARole({role:role});
        return promiseResult;
    }

    acceptWaitingUser(userId)
    {
        const promiseResult = UserModel.acceptWaitingUser({_id:userId});
        return promiseResult;
    }

    deleteUser(userId)
    {
        const promiseResult = UserModel.deleteUser({_id:userId});
        return promiseResult;
    }

    // added by thaer
    getUser(userId) {
        const result = UserModel.getUser(userId);
        return result;
    }

    findUserByUsername(username) {
        const result = UserModel.findUserByUsername(username);
        return result;
    }

    deleteAllUser() {
        const result = UserModel.deleteAllUser();
        return result;
    }
}; 
