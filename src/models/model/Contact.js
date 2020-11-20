const mongoose = require('mongoose')
const ContactSchema = require("../schema/Contact");

const ContactModel= mongoose.model('Contact', ContactSchema);

module.exports = {
    insert: function (newContact) {  
        const result = ContactModel.create(newContact);
        if(result)
            return result;
        else
            return {error:"Error with the creation Contact"}; 
    },

    update: function (Contact) {  
        const result = ContactModel.findByIdAndUpdate({_id: Contact._id}, Contact);
        if(result)
            return result;
        else
            return {error:"Error with the update Contact"}; 
    },

    delete: function (Contact) {  
        const result = ContactModel.findOneAndDelete({_id: Contact._id});
        if(result)
            return result;
        else
            return {error:"Error with the deletion Contact"}; 
    }
};