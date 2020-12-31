const express = require('express');
const router = express.Router();


const permissions = require('../business/Objects').PERMISSIONS;


router.get('/', (req, res) => {
    const role = req.query.role;
    if (role === 'admin' || role === 'carOwner' || role === 'garageOwner' || role === 'waitingUser') {
        permissions.findPermissions(role).then(permission => {
            res.send(permission);
        });
    } else {
        res.status(400).send({
            Error: 'role must be one those (admin or carOwner or garageOwner or waitingUser)'
        });
    }
});

router.put('/role/:role/add/:permission', (req, res) => {
    const role = req.params.role;
    const permission = req.params.permission;
    if (!permission) {
        return res.status(400).send({
            Error: 'error in permission param'
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
            Error: 'role must be one those (admin or carOwner or garageOwner or waitingUser)'
        });
    }
});

router.put('/autoAdding', (req, res) => {
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
        res.status(400).send({
            Error: 'Error in autoAdding'
        });
    });
});

module.exports = router;