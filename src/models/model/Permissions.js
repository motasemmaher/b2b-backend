const mongoose = require('mongoose')
const PermissionsSchema = require('../schema/Permissions');

const permissionsModel = mongoose.model('Perminssions', PermissionsSchema);

module.exports = {    
    
    createPermissions(value) {
        const result = permissionsModel.create(value);
        if(result) {
            return result;
        } else {
            return 'Error in createpermissions';
        }        
    },

    findPermissions(value) {
        const result = permissionsModel.findOne({
            role: value.role
        });
        
        if(result) {
            return result;
        } else {
            return 'Error in findPermissions';
        } 
    },

    addPermission(value) {
        const result = permissionsModel.findOneAndUpdate({
            role: value.role
        }, {
            $addToSet: {
                'perminssions': value.perminssion,
            }
        }, {
            "useFindAndModify": false
        });
        if(result) {
            return result;
        } else {
            return 'Error in addPermission';
        }
    },

    removePermission(value) {
        const result = permissionsModel.findOneAndUpdate({
            role: value.role
        }, {
            $pull: {
                perminssions: value.perminssion,
            }
        }, {
            "useFindAndModify": false
        });
        if(result) {
            return result;
        } else {
            return 'Error in removePermission';
        }
    }  
}