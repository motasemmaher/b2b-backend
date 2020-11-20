const mongoose = require('mongoose');
const AdminSchema = require("../schema/Admin");
const AdminModel= mongoose.model('Admin', AdminSchema);

module.exports = {
    createAdmin(value) {
        const result = AdminModel.create(value);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the creation Admin"
            };
        }
    },

    updateAdmin(value) {
        const result = AdminModel.findByIdAndUpdate({
            _id: value._id
        }, Admin);

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the update Admin"
            };
        }
    },

    deleteAdmin(value) {
        const result = AdminModel.findOneAndDelete({
            _id: value._id
        });

        if (result) {
            return result;
        } else {
            return {
                error: "Error with the delete Admin"
            };
        }
    },

    getAdmin(value) {
        const result = AdminModel.findById({
            _id: value._id
        });
        if (result)
            return result;
        else
            return {
                error: "Error with the getting Admin"
            };
    },

    deleteAllAdmin() {
        const result = AdminModel.deleteMany({});

        if (result)
            return result;
        else
            return {
                error: "Error with the delete all Admins"
            };
    }
};