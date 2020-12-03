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

    findUserById(value) {
        const result = UserModel.findById({_id: value.userId});
        if (result)
            return result;
        else
            return {error: "Error with the getting User"};
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
    },

    findAllUsersIdOfARole(value)
    {
        const result = UserModel.find({role:value.role},{_id:1});
        if (result)
            return result;
        else
            return {error: "Error with finding the ids of all users in that role."};
    }
    ,
    acceptWaitingUser(value)
    {
        const result = UserModel.findOneAndUpdate({_id:value._id},{role:'garageOwner'},{ "useFindAndModify": false });
        if (result)
            return result;
        else
            return {error: "Error with accepting WaitingUser"};
    }
};