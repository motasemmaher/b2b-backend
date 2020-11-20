const UserModel = require('../../models/model/User');

module.exports = class User {
    constructor (user)
    {}

    createUser(userInfo) {
        const result = UserModel.create(userInfo);
        return result;
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