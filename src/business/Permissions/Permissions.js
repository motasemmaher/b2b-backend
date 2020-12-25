const permissionsModel = require('../../models/model/Permissions');

module.exports = class Permissions {

    createPermissions(role) {
        const result = permissionsModel.createPermissions({
            role: role
        });
        return result;
    }

    findPermissions(role) {
        const result = permissionsModel.findPermissions({
            role: role
        });
        return result;
    }

    addPermission(role, perminssion) {
        const result = permissionsModel.addPermission({
            role: role,
            perminssion: perminssion
        });
        return result;
    }

    removePermission(role, perminssion) {
        const result = permissionsModel.removePermission({
            role: role,
            perminssion: perminssion
        });
        return result;
    }
}