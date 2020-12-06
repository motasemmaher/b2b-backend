const UserModel = require('../../models/model/User');

module.exports = class User {
    acceptWaitingUser(userId)
    {
        const promiseResult = UserModel.acceptWaitingUser({_id:userId});
        return promiseResult;
    }
    getAllUsersIdOfARole(role)
    {
        const promiseResult = UserModel.findAllUsersIdOfARole({role:role});
        return promiseResult;
    }
    getUserById(userId)
    {
        const promiseResult = UserModel.findUserById({userId:userId});
        return promiseResult;
    }
    validateUserInfo(userInfo)
    {
        const validationResult = UserValidation.validateUserInfo(userInfo);
        if(validationResult !== "pass")
            return {err:"Error: "+validationResult};
    }
    constructor (user)
    {}

    createUser(userInfo)
    {
        const promiseResult = UserModel.createUser(userInfo);
        return promiseResult;
    }

    updateUser(updatedUser) {
        const result = UserModel.updateUser(updatedUser);
        return result;
    }

    deleteUser(userId) {
        const result = UserModel.deleteUser(userId);
        return result;
    }

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
