const UserModel = require('../../models/model/User');

module.exports =  class User {
    constructor() {}

    getUserById(userId)
    {
        const userPromise = UserModel.findUserById({userId:userId});
        return userPromise;
    }

    getAllUsersIdOfARole(role)
    {
        const usersPromise = UserModel.findAllUsersIdOfARole({role:role});
        return usersPromise;
    }

    acceptWaitingUser(userId)
    {
        const userPromise = UserModel.acceptWaitingUser({_id:userId});
        return userPromise;
    }

    deleteUser(userId)
    {
        const userPromise = UserModel.deleteUser({_id:userId});
        return userPromise;
    }

}
