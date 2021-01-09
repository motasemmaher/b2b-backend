const express = require('express');
const router = express.Router();


const permissions = require('../business/Objects').PERMISSIONS;


router.get('/permissions', (req, res) => {
    const role = req.query.role;
    if (role === 'admin' || role === 'carOwner' || role === 'garageOwner' || role === 'waitingUser') {
        permissions.findPermissions(role).then(permission => {
            res.send(permission);
        });
    } else {
        res.status(400).send({
            error: 'ERROR_ROLE_MUST_BE_ONE_THOSE_ADMIN_OR_CAROWNER_OR_GARAGEOWNER_OR_WAITINGUSER'
        });
    }
});

router.put('/permissions/role/:role/add/:permission', (req, res) => {
    const role = req.params.role;
    const permission = req.params.permission;
    if (!permission) {
        return res.status(400).send({
            error: 'error in permission param'
        });
    }
    if (role === 'admin' || role === 'carOwner' || role === 'garageOwner' || role === 'waitingUser') {
        permissions.addPermission(role, permission).then(addedPermission => {
            res.send({
                msg: 'added successfully'
            });
        });
    } else {
        res.status(400).send({
            error: 'ERROR_ROLE_MUST_BE_ONE_THOSE_ADMIN_OR_CAROWNER_OR_GARAGEOWNER_OR_WAITINGUSER'
        });
    }
});

router.put('/permissions/autoAdding', (req, res) => {
    const prom = [];
    const arrPermissionCarOwner = ['createCarOwner', 'login', 'manageAccount', 'viewProduct', 'placeOrder',
        'maintainOrder', 'submitComplaint', 'chat', 'sos', 'viewStores'
    ];
    const arrPermissionGarageOwner = ['createGarageOwner', 'login', 'manageAccount', 'insertProduct',
        'viewProduct', 'updateProduct', 'deleteProduct', 'viewCategory', 'updateCategory', 'deleteCategory',
        'chat', 'manageOffers', 'viewComplaints'
    ];
    const arrPermissionAdmin = ['addUser', 'removeUser', 'viewUsers', 'viewComplaints'];

    arrPermissionCarOwner.forEach((item, index) => {
        prom.push(permissions.addPermission('carOwner', item));
    });
    arrPermissionGarageOwner.forEach((item, index) => {
        prom.push(permissions.addPermission('garageOwner', item));
    });
    arrPermissionAdmin.forEach((item, index) => {
        prom.push(permissions.addPermission('admin', item));
    });
    Promise.all(prom).then(values => {
        res.send({
            msg: 'successfully added all permissions'
        });
    }).catch(err => {
        res.status(500).send({
            error: 'INTERNAL_SERVER_ERROR'
        });
    });
});

module.exports = router;