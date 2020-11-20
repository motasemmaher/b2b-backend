const mongoose = require('mongoose')
const AdminSchema = require("../schema/Admin");

const AdminModel= mongoose.model('Admin', AdminSchema);

module.exports =
{
    insert: function (newUser) {  
        AdminModel.create(newUser).then(result => console.log("Inserted new user"))
        .catch(err => console.log("Error with the creation: " + err));
    },

    update: function (user) {  
        AdminModel.findByIdAndUpdate({_id: user._id}, user).then(result => console.log("User updated"))
        .catch(err => console.log("Error with the update"));
    },

    // findOne: function (id) {  
    //     AdminModel.findOne({_id: id}).then(result => {
    //         console.log("User deleted");
    //         return result;
    //     }).catch(err => console.log("Error with the deleted"));        
    // },

    delete: function (user) {  
        AdminModel.findOneAndDelete({_id: user._id}).then(result => console.log("User deleted"))
        .catch(err => console.log("Error with the deleted"));
    }
};