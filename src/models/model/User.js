const mongoose = require('mongoose')
const UserSchema = require("../schema/User");

const UserModel= mongoose.model('User', UserSchema);

module.exports = {
    insert: function (newUser) {  
        const result = UserModel.create(newUser);
        
        if(result)
            return result;
        else
            return {error:"Error with the creation User"};  
    },

    update: function (user) {  
        const result = UserModel.findByIdAndUpdate({_id: user._id}, user);
        
        if(result)
            return result;
        else
            return {error:"Error with the update User"};  
    },

    delete: function (user) {  
        const result = UserModel.findOneAndDelete({_id: user._id}).then(()=> console.log("Deleted user")).catch(()=>console.log("Error with deleting user"));

        if(result)
            return result;
        else
            return {error:"Error with the deletion User"};  
    }
};