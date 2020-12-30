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

    addPermission(role, permission) {
        const result = permissionsModel.addPermission({
            role: role,
            permission: permission
        });
        return result;
    }

    removePermission(role, permission) {
        const result = permissionsModel.removePermission({
            role: role,
            permission: permission
        });
        return result;
    }
}