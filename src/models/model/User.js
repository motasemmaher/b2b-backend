const mongoose = require('mongoose');
const UserSchema = require("../schema/User");
const UserModel = mongoose.model('User', UserSchema);

module.exports = {

    exists(value)
    {
        const result = UserModel.exists({_id: value.userId},{id:1});
        if (result)
            return result;
        else
            return {
                error: "Error with the getting User"
            };
    },
    checkUsername(value)
    {
        const result = UserModel.findOne({username: value.username},{id:1});
        if (result)
            return result;
        else
            return {
                error: "Error with the getting User"
            };
    }
    ,
    checkPhone(value)
    {
        const result = UserModel.findOne({phoneNumber: value.phone},{id:1});
        if (result)
            return result;
        else
            return {
                error: "Error with the getting User"
            };
    }
    ,
    checkEmail(value)
    {
        const result = UserModel.findOne({email: value.email},{id:1});
        if (result)
            return result;
        else
            return {
                error: "Error with the getting User"
            };
    }
    ,

    countByRole(value) {
        const count = UserModel.countDocuments({
            role: value.role
        });
        return count;
    },

    countAll() {
        const count = UserModel.countDocuments({
            role: {
                $in: ['carOwner', 'garageOwner']
            }
        });
        return count;
    },

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
            },
            value, {
                "useFindAndModify": false
            }
        );

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
        }).then().catch();

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete User"
            };
        }
    },

    findUserById(value) {
        const result = UserModel.findById({
            _id: value.userId
        },
        {
            password:0
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting User"
            };
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
    },

    findAllUsersIdOfARole(value) {
        const result = UserModel.find({
            role: value.role
        }, {
            _id: 1
        });
        if (result)
            return result;
        else
            return {
                error: "Error with finding the ids of all users in that role."
            };
    },
    
    acceptWaitingUser(value) {
        const result = UserModel.findOneAndUpdate({
            _id: value._id
        }, {
            role: 'garageOwner'
        }, {
            "useFindAndModify": false
        });
        if (result)
            return result;
        else
            return {
                error: "Error with accepting WaitingUser"
            };
    }
    
};