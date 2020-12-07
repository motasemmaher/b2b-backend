const mongoose = require('mongoose');
const ContactSchema = require("../schema/Contact");
const ContactModel= mongoose.model('Contact', ContactSchema);

module.exports = {
    createContact(value) {
        const result = ContactModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation Contact"
            };
        }
    },

    updateContact(value) {
        const result = ContactModel.findOneAndUpdate({
            _id: value._id
        },  value, { "useFindAndModify": false });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update Contact"
            };
        }
    },

    deleteContact(value) {
        const result = ContactModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete Contact"
            };
        }
    },

    getContact(value) {
        const result = ContactModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Contact"
            };
    },

    deleteAllContact() {
        const result = ContactModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all Contacts"
            };
    }
};