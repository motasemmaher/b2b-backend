const ContactModel = require('../../models/model/Contact');

module.exports = class Contact {
    createContact(contactInfo) {
        const result = ContactModel.createContact(contactInfo);
        return result;
    }

    updateContact(updatedContact) {
        const result = ContactModel.updateContact(updatedContact);
        return result;
    }

    deleteContact(ownerId) {
        const result = ContactModel.deleteContact({
            ownerId: ownerId
        });
        return result;
    }

    getContact(contactId) {
        const result = ContactModel.getContact({
            _id: contactId
        });
        return result;
    }

    getContactByOwnerId(ownerId) {
        const result = ContactModel.getContactByOwnerId({
            ownerId: ownerId
        });
        return result;
    }

    getContactByOwnerIdAndSubContactId(ownerId, subContactId) {
        const result = ContactModel.getContactByOwnerIdAndSubContactId({
            ownerId: ownerId,
            subContactId: subContactId
        });
        return result;
    }

    deleteAllContact() {
        const result = ContactModel.deleteAllContact();
        return result;
    }
};