const UserModel = require('../../models/model/User');
const UserValidation = require('./validate');
module.exports =  class User {
    constructor() {}

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

}
