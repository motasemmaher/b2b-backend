const mongoose = require('mongoose');
const UserSchema = require("../schema/User");
const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    createUser(value) {
        const result = UserModel.create(value);
        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation User"
            };
        }
    },

    updateUser(value) {
        const result = UserModel.findByIdAndUpdate({
            _id: value._id
        }, user);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update User"
            };
        }
    },

    deleteUser(value) {
        const result = UserModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete User"
            };
        }
    },

    getUser(value) {
        const result = UserModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting User"
            };
    },

    findUserByUsername(username) {
        const result = UserModel.findOne({
            username: username
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the delete all Users"
            };
    },

    deleteAllUser() {
        const result = UserModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all Users"
            };
    }
};